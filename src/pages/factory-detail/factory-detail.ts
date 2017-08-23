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
  private factory: any;
  private machineIds: number[] = [];
  private sub: any;

  topDowntimeCodes: [string[], number[]];

  constructor(public dataProvider: DowntimeData, public navCtrl: NavController, public navParams: NavParams) {
    for (const factory of this.dataProvider.getFactories()) {
      if (factory && factory.id == this.navParams.data.factoryId) {
        this.factory = factory;
        factory.machines.forEach((machine: any) => {
          this.machineIds.push(machine.id);
        });
        break;
      }
    }
  }

  ngOnInit() {
    let me = this;
    this.sub = this.dataProvider.getClock().subscribe(time => {
      me.topDowntimeCodes = this.dataProvider.gatherDowntimeCodesForMachines(this.machineIds, time, 5);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push('MachineDetailPage', { machineId: machine.id });
  }

  get hasDowntimeCodes() : boolean {
    return this.topDowntimeCodes != null && this.topDowntimeCodes[0].length > 0;
  }
}
