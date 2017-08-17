import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

@IonicPage({
  segment: 'machine/:machineId'
})
@Component({
  selector: 'page-machine-detail',
  templateUrl: 'machine-detail.html'
})
export class MachineDetailPage {
  private machine: any;
  private downtimeCodes: any[] = [];

  constructor(public downtimeData: DowntimeData, public navCtrl: NavController, public navParams: NavParams) {
    for (const machine of this.downtimeData.getMachines()) {
      if (machine && machine.id == this.navParams.data.machineId) {
        this.machine = machine;
        break;
      }
    }

    const machineId = this.machine.id;
    const events = this.downtimeData.getDowntimeEvents().filter(function(event:any){
      return event.machineId == machineId;
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
    this.downtimeCodes = Object.keys(reasons).map(function(key:any) {
      return [key, reasons[key]];
    });
    this.downtimeCodes.sort(function(first, second) {
        return second[1] - first[1];
    });
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push('MachineDetailPage', { machineId: machine.id });
  }

  get schedule(): any {
    const schedule = this.machine.factory.schedules[this.machine.schedule];
    return schedule;
  }

  get downtime(): any {
    const e = this.downtimeData.getDowntimeEvents().find((e: any) => e.id == this.machine.downtimeEventId);
    return this.downtimeData.getDowntimeCodes().find((d: any) => d.codeId == e.codeId);
  }
  
  get topDowntimeCodeCategories(): any[] {
    let result: any[] = [];
    this.downtimeCodes.forEach((pair: any[]) => {
      const code = this.downtimeData.getDowntimeCodes().find((d: any) => d.codeId == pair[0]);      
      result.push(code.description);
    });
    return result.slice(0, 5);
  }

  get topDowntimeCodeTotals(): any {
    let result: any[] = [];
    this.downtimeCodes.forEach((pair: any[]) => {
      result.push(pair[1]);
    });
    return result.slice(0, 5);
  }
}

