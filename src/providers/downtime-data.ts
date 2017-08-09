import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import {MultiDictionary} from 'typescript-collections';

class Event {
  public machineId: number;
  public startDate: Date;
  public endDate: Date;
}

@Injectable()
export class DowntimeData {
  data: any;

  public playing: boolean = true;
  public start: Date;
  public end: Date;
  public eventCount: number = 0;

  private clock: Observable<Date>;
  public overallHealthMax: number = 0;
  public overallHealth: number = 0;

  private currentDate: Date = new Date();
  private ticks: number = 1;
  private _eventIdx: number = 0;
 
  private events: MultiDictionary<number,Event>;

  constructor(public http: Http, public user: UserData) {
    this.events = new MultiDictionary<number,Event>();
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

    // loop through each machine and gather up some useful info
    this.data.machines.forEach((machine: any) => {

      this.overallHealthMax = this.overallHealthMax + 1;
      if( machine.up ) {
        this.overallHealth = this.overallHealth + 1;
      }

      let factory = this.data.factories.find((f: any) => f.id === machine.factoryId);
      if( factory ) {
        factory.machines = factory.machines || []
        factory.machines.push(machine);
        machine.factory = factory;
      }

      machine.downtimeEvents.forEach((event: any) => {
        var e: Event = new Event();
        e.machineId = machine.machineId;
        
        let a = event.durationHoursMins.split(':');
        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60; 
        e.startDate = new Date(event.startTime);
        e.endDate = new Date(event.startTime+seconds*1000);
        this.events.setValue(event.startTime,e);
      });
    });

    this.eventCount = this.events.size();
    this.eventIdx = 0;

    return this.data;
  }
  getData() {
    return Observable.of(this.data);
  }

  getFactories() {
    return this.getData().map((data: any) => {
      return data.factories.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getMachines() {
    return this.getData().map((data: any) => {
      return data.machines;
    });
  }

  getMap() {
    return this.getData().map((data: any) => {
      return data.map;
    });
  }

  get eventIdx(): number {
    return this._eventIdx;
  }

  set eventIdx(value: number) {
    this._eventIdx = value;

    let key: number = this.events.keys()[this._eventIdx];
    let event: Event = this.events.getValue(key)[0];
    this.updateMachines(event);
    this.start = event.startDate;
    this.end = event.endDate;
    this.currentDate = this.start;
  }

  updateMachines(event:Event) {
    this.data.machines.forEach((machine: any) => {
      machine.up = true;
    });
    var machine = this.data.machines.find((m: any) => m.machineId === event.machineId);
    machine.up = false;
    this.overallHealth = this.overallHealth - 1;
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

}
