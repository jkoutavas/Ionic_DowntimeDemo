import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class DowntimeData {
  data: any;

  public playing: boolean = true;
  public start: Date;
  public end: Date;
   public days: number = -60;

  private clock: Observable<Date>;
  private startingDate: Date = new Date();
  private ticks: number = 1;
  private _day: number = -60;
 
  constructor(public http: Http, public user: UserData) {
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

    // loop through each line
    this.data.machines.forEach((machine: any) => {
      let factory = this.data.factories.find((f: any) => f.id === machine.factoryId);
      if( factory ) {
        factory.machines = factory.machines || []
        factory.machines.push(machine);
        machine.factory = factory;
      }
    });
  
    this.end = new Date;
    this.start = new Date();
    this.start.setDate(this.start.getDate()+this.days);
    this.setStartingDate(this.start);
  
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
    date.setDate(this.end.getDate()+this._day);
    this.setStartingDate(date);
  }

  incrementDate(): Date {
    if( this.playing ) {
      this.startingDate = new Date(this.startingDate.getTime() + 1000*this.ticks);
    }

    return this.startingDate;
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

  setStartingDate(date: Date) {
    this.startingDate = date;
  }
  
  togglePlay() : boolean {
    this.playing = !this.playing;

    return this.playing;
  }

}
