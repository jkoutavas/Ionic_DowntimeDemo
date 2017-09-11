import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

const moment = require('../../node_modules/moment/moment.js');

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

export type DowntimeReasonsType = {
  descriptions:string[],
  totals:number[]
}

export type DowntimeTrendsType = {
  scheduled:number[],
  unplanned:number[],
  uptime:number[],
  startDateUTC:number,
  interval:number
}

export enum CriteriaEnum {
  Day = 0,
  Week,
  Month,
  PrevDay,
  PrevWeek,
  PrevMonth
}

export type DayRangeType = {
  startTime:number,
  endTime:number, 
  days:number, 
  dayIncrement:number
}

@Injectable()
export class DowntimeData {
  private data: any;

  public playing: boolean = true;

  private clock: Observable<Date>;
  
  public overallHealthMax: number = 0;

  public overallHealth: BehaviorSubject<number>;

  private currentDate: Date = new Date();
  private ticks: number = 1;
  private _eventIdx: number = 0;
 
  public reportCriteria: any[] = [
    {
      'label': 'Day',
      'value': CriteriaEnum.Day,
      'disabled': false
    } , {
      'label': 'Week',
      'value': CriteriaEnum.Week,
      'disabled': false
    } , {
      'label': 'Month',
      'value': CriteriaEnum.Month,
      'disabled': false
    } , {
      'label': 'Previous Day',
      'value': CriteriaEnum.PrevDay,
      'disabled': false
    } , {
      'label': 'Previous Week',
      'value': CriteriaEnum.PrevWeek,
      'disabled': false
    } , {
      'label': 'Previous Month',
      'value': CriteriaEnum.PrevMonth,
      'disabled': true
    }
  ];
  
  public selectedReportCriteria: BehaviorSubject<CriteriaEnum> = new BehaviorSubject(CriteriaEnum.Week);

  constructor(public http: Http, public user: UserData) {
    this.clock = Observable.interval(1000).map(_ => this.incrementDate()).share();
  }

  load(): Promise<any> {
    this.data = null;

    return this.http
            .get('assets/data/data.json')
            .map(this.processData, this)
            .toPromise()
            .then((data: any) => this.data = data)
            .catch((_: any) => Promise.resolve());
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking factories to machines
    this.data = data.json();

    this.overallHealthMax = this.data.machines.length;
    this.overallHealth = new BehaviorSubject(this.overallHealthMax);
    
    // loop through each machine and gather up some useful info
    this.data.machines.forEach((machine: any) => {
      let factory = this.data.factories.find((f: any) => f.id == machine.factoryId);
      if( factory ) {
        factory.upMachines = factory.upMachines || 0;
        factory.machines = factory.machines || [];
        factory.machines.push(machine);
        factory.upMachines++;
        machine.factory = factory;
      }
    });

    const events = this.data.downtimeEvents.sort((a: any, b: any) => {
        return a.startTime - b.startTime;
    });
    
    // generate the filler "up time" events
    this.data.downtimeEvents = [];
    for( let i=0; i<events.length-1; ++i ) {
      const thisEvent = events[i];
      const e = moment(events[i].endTime);
      const s = moment(events[i].startTime);
      const diff = e.diff(s,'minutes');
      if( diff > 23*60 ) {
        console.log("!!!!event "+i+" durtion is "+Math.round(diff/60)+" hours!!!!");
        continue;
      } else if( events[i].endTime < events[i].startTime ) {
        console.log("!!!!event "+i+" duration is negative!!!!");
      }
      this.data.downtimeEvents.push(thisEvent);
      const nextEvent = events[i+1];
      if( thisEvent.machineId == nextEvent.machineId ) {
        this.data.downtimeEvents.push({
          "id": 0,
          "codeId": 0,
          "machineId": thisEvent.machineId,
          "startTime": thisEvent.endTime+1,
          "endTime": nextEvent.startTime-1
        });
      }
    }

    // clean-up titles on downtime codes 
    this.data.downtimeCodes.forEach((code: any) => {
      code.description = this.titleCase(code.description);
    });

    this.eventIdx = 1017; // pick something mid the event range

    return this.data;
  }

  get eventCount(): number {
    return this.data.downtimeEvents.length;
  }

  getCompany() {
    return this.data.company;
  }

  getFactories() {
    return this.data.factories.sort((a: any, b: any) => {
        const aName = a.name.split(' ').pop();
        const bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
  }

  getMachines() {
    return this.data.machines;
  }

  getMap() {
    return this.data.map;
  }

  getDowntimeCodes() {
    return this.data.downtimeCodes;
  }

  getDowntimeEvents() {
    return this.data.downtimeEvents;
  }

  get eventIdx(): number {
    return this._eventIdx;
  }

  set eventIdx(value: number) {
    this._eventIdx = value;
    const event = this.data.downtimeEvents[this._eventIdx];
    this.currentDate = new Date(event.startTime);
    this.updateMachines();
  }

  updateMachines() {
    const currentTime = this.currentDate.getTime();
    let overallHealth = this.overallHealthMax;
    this.data.machines.forEach((machine: any) => {
      machine.downtimeEventId = 0;
      const events = this.data.downtimeEvents.filter((e: any) => e.machineId == machine.id);
      for( let e of events ) {
        if (currentTime >= e.startTime && currentTime < e.endTime) {
          if( e.id != 0 ) { // e.id==0 represents uptime event
            overallHealth--;
          }
          machine.downtimeEventId = e.id;
          break;
        }
      };
    });

    this.data.factories.forEach((factory: any) => {
      factory.upMachines = 0;
      factory.machines.forEach((machine: any) => {
        if(machine.downtimeEventId==0) {
          factory.upMachines++;
        }
      });
    });
    
    this.overallHealth.next(overallHealth);
  }

  incrementDate(): Date {
    if( this.playing ) {
      const newTime = this.currentDate.getTime() + 1000*this.ticks;
      this.currentDate = new Date(newTime);
      const currentEvent = this.data.downtimeEvents[this.eventIdx];
      if( newTime > currentEvent.endTime && this.eventIdx < this.data.downtimeEvents.length-1 ) {
        this.eventIdx = this.eventIdx+1;
      }
    }

    return this.currentDate;
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

  togglePlay() : boolean {
    this.playing = !this.playing;

    return this.playing;
  }

  get startDate() : Date {
    return new Date(this.data.downtimeEvents[this.eventIdx].startTime);
  }

  get endDate() : Date {
    return new Date(this.data.downtimeEvents[this.eventIdx].endTime);
  }

  isScheduledDowntimeEvent(event:any) : boolean {
    return event.codeId == 15864 /* scheduled downtime */  || event.codeId == 16024 /*end of shift*/;
  }

  getDayRange(criteria:CriteriaEnum): DayRangeType {
    let endTime = this.currentDate.getTime();
    let endMoment = moment(endTime);
    endMoment.endOf('day');
    let startMoment = moment(endMoment);

    let dayIncrement = 1;
    switch( criteria ) {
      case CriteriaEnum.Day:
        startMoment.startOf('day');
      break;
      
      case CriteriaEnum.Week:
        startMoment.startOf('week');
      break;
      
      case CriteriaEnum.Month:
        startMoment.startOf('month');
        dayIncrement = 7;
      break;

      case CriteriaEnum.PrevDay:
        startMoment.startOf('day');
        endMoment.add(-1,'days');
        startMoment.add(-1,'days');
      break;

      case CriteriaEnum.PrevWeek:
        endMoment.add(-1,'weeks').endOf('week');
        startMoment = moment(endMoment);
        startMoment.add(-1,'weeks').startOf('day');
      break;

      case CriteriaEnum.PrevMonth:
        endMoment.add(-1,'months').endOf('month');
        startMoment = moment(endMoment);
        startMoment.add(-1,'months').startOf('month');
        dayIncrement = 7;
      break;
    }

    return {
      startTime:startMoment.valueOf(), 
      endTime:endMoment.valueOf(), 
      days:endMoment.diff(startMoment,'days'), 
      dayIncrement:dayIncrement
    };
  }

  gatherEvents(machineIds:any[], dayRange:DayRangeType, uptime:boolean) : any[] {
    return this.data.downtimeEvents.filter(function(event:any){
      return (machineIds.length==0 || machineIds.includes(event.machineId)) && 
        event.startTime >= dayRange.startTime && 
        event.startTime < dayRange.endTime &&
        uptime || event.codeId != 0;
    });
  }

  gatherDowntimeReasons(machineIds:any[], criteria:CriteriaEnum) : DowntimeReasonsType {
    const dayRange:DayRangeType = this.getDayRange(criteria);
    const events = this.gatherEvents(machineIds, dayRange, false);
    let reasons: { [id: number] : number; } = {}
    events.forEach((event: any) => {
      if( reasons[event.codeId] === undefined ) {
        reasons[event.codeId] = 1;
      } else {
        reasons[event.codeId]++;
      }
    });
    let downtimeCodes = Object.keys(reasons).map(function(key:any) {
      return [key, reasons[key]];
    });
    downtimeCodes.sort(function(first, second) {
      return second[1] - first[1];
    });
    
    let descriptions: string[] = [];
    let totals: number[] = [];
    downtimeCodes.forEach((pair: any[]) => {
      const code = this.data.downtimeCodes.find((d: any) => d.codeId == pair[0]);  
      descriptions.push(code.description);
      totals.push(pair[1]); 
    });

    return {descriptions:descriptions, totals:totals};
  }

  gatherDowntimeTrends(machineIds:any[], criteria:CriteriaEnum) : DowntimeTrendsType {
    const dayRange:DayRangeType = this.getDayRange(criteria);
    const events = this.gatherEvents(machineIds, dayRange, true);
    let scheduled:number[] = Array(dayRange.days>1?dayRange.days:24).fill(0);
    let unplanned:number[] = Array(dayRange.days>1?dayRange.days:24).fill(0);
    let uptime:number[] = Array(dayRange.days>1?dayRange.days:24).fill(0);

    let current = moment(dayRange.startTime).endOf('day');
    let i = 0;
    let j = 0;
    while( j < events.length ) {
      const event = events[j];
      if( event.startTime > current.valueOf() ) {
        i++;
        if( i == dayRange.days ) {
          break;
        }
        if( dayRange.days > 1 ) {
          current.add(1,'days');
        } else {
          current.add(1,'hour');
        }
      }
      const e = moment(event.endTime);
      const s = moment(event.startTime);
      const minutes = e.diff(s,'minutes');
      const hours = Math.round(minutes/60);
      if( this.isScheduledDowntimeEvent(event) == true ) {
        scheduled[i] = scheduled[i] + hours;
      } else if ( event.codeId != 0 ) {
        unplanned[i] = unplanned[i] + hours;
      } else {
        uptime[i] = uptime[i] + hours;
      }
      j++;
    } 
    
    const start = moment(dayRange.startTime);
    return {
      scheduled:scheduled, 
      unplanned:unplanned,
      uptime:uptime,
      startDateUTC:Date.UTC(start.get('year'), start.get('month'), start.get('date')),
      interval: (dayRange.days>1?24:1) * 3600 * 1000
    };
  }

  titleCase(str:string) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }
}
