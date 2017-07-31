import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class DowntimeData {
  data: any;

  constructor(public http: Http, public user: UserData) { }

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

}
