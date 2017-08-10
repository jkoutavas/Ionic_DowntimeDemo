import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable, Observer } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

class Event {
  public machineId: number;
  public startDate: Date;
  public endDate: Date;
}

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
 
  private events: Event[];

  constructor(public http: Http, public user: UserData) {
    this.events = [];
    this.clock = Observable.interval(1000).map(_ => this.incrementDate()).share();
    this.overallHealth = new Observable((observer: Observer<number>) => {
      this.overallHealthObserver = observer;
    });
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
    this.eventCount = 0;

    // loop through each machine and gather up some useful info
    this.data.machines.forEach((machine: any) => {

      if( machine.up ) {
        this._overallHealth++;
      }

      let factory = this.data.factories.find((f: any) => f.id === machine.factoryId);
      if( factory ) {
        factory.machines = factory.machines || []
        factory.machines.push(machine);
        machine.factory = factory;
      }

      machine.downtimeEvents.forEach((event: any) => {
        var e: Event = new Event();
        e.machineId = machine.id;
        
        let a = event.durationHoursMins.split(':');
        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60; 
        e.startDate = new Date(event.startTime);
        e.endDate = new Date(event.startTime+seconds*1000);
        this.events.push(e);
        this.eventCount++;
      });
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

  get eventIdx(): number {
    return this._eventIdx;
  }

  set eventIdx(value: number) {
    this._eventIdx = value;
    let event = this.events[this._eventIdx];
    this.currentDate = event.startDate;
    this.updateMachines();
  }

  updateMachines() {
    this._overallHealth = this.overallHealthMax;
    this.data.machines.forEach((machine: any) => {
      machine.up = true;
    });
    this.events.forEach((event: Event) => {
      var machine = this.data.machines.find((m: any) => m.id === event.machineId);
      if (this.currentDate >= event.startDate && this.currentDate <= event.endDate) {
        this._overallHealth--;
        machine.up = false;
      }
    });

    if( this.overallHealthObserver ) {
      this.overallHealthObserver.next(this._overallHealth);
    }
  }

  incrementDate(): Date {
    if( this.playing ) {
      this.currentDate = new Date(this.currentDate.getTime() + 1000*this.ticks);
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
    return this.events[this.eventIdx].startDate;
  }

  get endDate() : Date {
    return this.events[this.eventIdx].endDate;
  }
}
