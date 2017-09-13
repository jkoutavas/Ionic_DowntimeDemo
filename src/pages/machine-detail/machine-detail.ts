import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DowntimeDetailPage } from '../../pages/downtime-detail/downtime-detail';

import { DowntimeData, DowntimeReasonsType, DowntimeTrendsType } from '../../providers/downtime-data';

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
  private sub2: any;

  downtimeCodes: DowntimeReasonsType;
  downtimeTrends: DowntimeTrendsType;
  machineStatus: any;

  get show() {
    return this.machineStatus != undefined && this.machineStatus.events.length > 0;
  }

  get title() {
     return this.machine.name + " @ " + this.machine.factory.name;
  }

  constructor(public downtimeData: DowntimeData, public navCtrl: NavController, public navParams: NavParams) {
    for (const machine of this.downtimeData.getMachines()) {
      if (machine && machine.id == this.navParams.data.machineId) {
        this.machine = machine;
        break;
      }
    }
  }

  ionViewDidLoad() {
    this.sub = this.downtimeData.overallHealth.subscribe(_ => {
      this.updateGraphs();
    });
 
    this.sub2 = this.downtimeData.selectedReportCriteria.subscribe(_ => {
      this.updateGraphs();
     });
  }

  updateGraphs() {
    const criteria = this.downtimeData.selectedReportCriteria.getValue();

    this.downtimeCodes = this.downtimeData.gatherDowntimeReasons([this.machine.id], criteria);
    this.downtimeTrends = this.downtimeData.gatherDowntimeTrends([this.machine.id], criteria);

    const events = this.downtimeData.gatherEvents([this.machine.id], this.downtimeData.getDayRange(criteria), true);
    this.machineStatus = {machine:this.machine, events:events};
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
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

  gotoDowntimeDetails() {
    this.navCtrl.push(DowntimeDetailPage, { title:this.machine.name, machineIds:[this.machine.id] });
  }
}

