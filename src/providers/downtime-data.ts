import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable, Observer } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class DowntimeData {
  private data: any;

  public playing: boolean = true;
  public eventCount: number = 0;

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
    this.eventCount = this.data.downtimeEvents.length;

    // loop through each machine and gather up some useful info
    this.data.machines.forEach((machine: any) => {
      if( machine.downtimeEventId == 0 ) {
        this._overallHealth++;
      }

      let factory = this.data.factories.find((f: any) => f.id == machine.factoryId);
      if( factory ) {
        factory.upMachines = factory.upMachines || 0;
        factory.machines = factory.machines || [];
        factory.machines.push(machine);
        factory.upMachines++;
        machine.factory = factory;
      }
    });

    this.data.downtimeEvents = this.data.downtimeEvents.sort((a: any, b: any) => {
        return a.startTime - b.startTime;
    });
    this.eventIdx = 0;

    return this.data;
  }

  getData() {
    return Observable.of(this.data);
  }

  getFactories() {
    return this.data.factories.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
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
    let event = this.data.downtimeEvents[this._eventIdx];
    this.currentDate = new Date(event.startTime);
    this.updateMachines();
  }

  updateMachines() {
    let currentTime = this.currentDate.getTime();
    this._overallHealth = this.overallHealthMax;
    this.data.machines.forEach((machine: any) => {
      machine.downtimeEventId = 0;
      let events = this.data.downtimeEvents.filter((e: any) => e.machineId == machine.id);
      for( let e of events ) {
        if (currentTime >= e.startTime && currentTime < e.endTime) {
          this._overallHealth--;
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
      let newTime = this.currentDate.getTime() + 1000*this.ticks;
      this.currentDate = new Date(newTime);
      let currentEvent = this.data.downtimeEvents[this.eventIdx];
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
}
