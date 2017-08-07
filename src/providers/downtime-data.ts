import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import {MultiDictionary} from 'typescript-collections';

@Injectable()
export class DowntimeData {
  data: any;

  public playing: boolean = true;
  public start: Date;
  public end: Date;
  public days: number = 0;

  private clock: Observable<Date>;
  private currentDate: Date = new Date();
  private ticks: number = 1;
  private _day: number = 0;
 
  private events: MultiDictionary<number,object>;

  constructor(public http: Http, public user: UserData) {
    this.events = new MultiDictionary<number,object>();
    this.clock = Observable.interval(1000).map(_ => this.incrementDate()).share();
  }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking factories to machines
    this.data = data.json();

    var firstEventTime: number = Number.MAX_VALUE;
    var lastEventTime: number = Number.MIN_VALUE;

    // loop through each machine and gather up some useful info
    this.data.machines.forEach((machine: any) => {
      let factory = this.data.factories.find((f: any) => f.id === machine.factoryId);
      if( factory ) {
        factory.machines = factory.machines || []
        factory.machines.push(machine);
        machine.factory = factory;
      }

      machine.downtimeEvents.forEach((event: any) => {
        firstEventTime = Math.min(event.startTime,firstEventTime);
        lastEventTime = Math.max(event.endTime,lastEventTime);
        this.events.setValue(event.startTime,{"machineId":machine.machineId,"event":event});
      });
    });
    let difference: number = lastEventTime - firstEventTime;
    let totalSeconds = difference / 1000;
    this.days = Math.max(Math.floor(totalSeconds / 86400), 1);

    this.start = new Date(firstEventTime);
    this.end = new Date(lastEventTime);
    this.currentDate = this.start;
    
    console.log("event count = " + this.events.size());
    
    return this.data;
  }

  getFactories() {
    return this.load().map((data: any) => {
      return data.factories.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getMachines() {
    return this.load().map((data: any) => {
      return data.machines;
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }

  get day(): number {
    return this._day;
  }

  set day(value: number) {
    this._day = value;

    var date: Date = new Date();
    date.setDate(this.start.getDate()+this._day);
    this.currentDate = date;
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
