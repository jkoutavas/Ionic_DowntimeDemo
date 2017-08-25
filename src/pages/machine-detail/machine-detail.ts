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
  private sub: any;

  downtimeCodes: [string[], number[]];
  
  constructor(public downtimeData: DowntimeData, public navCtrl: NavController, public navParams: NavParams) {
    for (const machine of this.downtimeData.getMachines()) {
      if (machine && machine.id == this.navParams.data.machineId) {
        this.machine = machine;
        break;
      }
    }
  }

  ngOnInit() {
    let me = this;
    this.sub = this.downtimeData.getClock().subscribe(time => {
      me.downtimeCodes = me.downtimeData.gatherDowntimeCodesForMachines([this.machine.id], time.getTime());
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  get hasDowntimeCodes() : boolean {
    return this.downtimeCodes != null && this.downtimeCodes[0].length > 0;
  }
}

