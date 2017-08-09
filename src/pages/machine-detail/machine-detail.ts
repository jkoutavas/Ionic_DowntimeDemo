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
  machine: any;

  constructor(public dataProvider: DowntimeData, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.dataProvider.getData().subscribe((data: any) => {
      if (data && data.machines) {
        for (const machine of data.machines) {
          if (machine && machine.id === this.navParams.data.machineId) {
            this.machine = machine;
            break;
          }
        }
      }
    });

  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push('MachineDetailPage', { machineId: machine.id });
  }
}
