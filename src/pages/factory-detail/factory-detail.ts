import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

@IonicPage({
  segment: 'factory/:factoryId'
})
@Component({
  selector: 'page-factory-detail',
  templateUrl: 'factory-detail.html'
})
export class FactoryDetailPage {
  factory: any;

  constructor(public dataProvider: DowntimeData, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    for (const factory of this.dataProvider.getFactories()) {
      if (factory && factory.id === this.navParams.data.factoryId) {
        this.factory = factory;
        break;
      }
    }
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push('MachineDetailPage', { machineId: machine.id });
  }
}
