import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable, Observer } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

export type DowntimeReasonsType = {
  descriptions:string[],
  totals:number[]
}

@Injectable()
export class DowntimeData {
  private data: any;

  public playing: boolean = true;

  private clock: Observable<Date>;
  
  public overallHealthMax: number = 0;

  public overallHealth: Observable<number>;
  private overallHealthObserver: Observer<number>;
  public _overallHealth: number = 0;

  private currentDate: Date = new Date();
  private ticks: number = 1;
  private _eventIdx: number = 0;
 
  constructor(public http: Http, public user: UserData) {
    this.clock = Observable.interval(1000).map(_ => this.incrementDate()).share();
    this.overallHealth = new Observable((observer: Observer<number>) => {
      this.overallHealthObserver = observer;
    }).share();
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
    this._overallHealth = this.overallHealthMax;
    
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

    this.eventIdx = 1407; // pick something mid the event range

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
    this._overallHealth = this.overallHealthMax;
    this.data.machines.forEach((machine: any) => {
      machine.downtimeEventId = 0;
      const events = this.data.downtimeEvents.filter((e: any) => e.machineId == machine.id);
      for( let e of events ) {
        if (currentTime >= e.startTime && currentTime < e.endTime) {
          if( e.id != 0 ) { // e.id==0 represents uptime event
            this._overallHealth--;
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
    
    if( this.overallHealthObserver ) {
      this.overallHealthObserver.next(this._overallHealth);
    }
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

  isScheduledDowntimeEvent(event:any) {
    return event.codeId == 15684 /* scheduled downtime */  || event.codeId == 16024 /*end of shift*/;
  }

  gatherDowntimeReasons(machineIds:any[], endTime:number) : DowntimeReasonsType {
    const events = this.data.downtimeEvents.filter(function(event:any){
      return (machineIds.length==0 || machineIds.includes(event.machineId)) && event.startTime < endTime;
    });
    let reasons: { [id: number] : number; } = {}
    events.forEach((event: any) => {
      if( event.codeId ) {
        if( reasons[event.codeId] === undefined ) {
          reasons[event.codeId] = 1;
        } else {
          reasons[event.codeId]++;
        }
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
}
