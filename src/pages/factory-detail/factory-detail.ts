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

  downtimeCodes: [string[], number[]];

  constructor(
    private dataProvider: DowntimeData, 
    private navCtrl: NavController, 
    private navParams: NavParams
  ) {
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
      me.downtimeCodes = this.dataProvider.gatherDowntimeCodesForMachines(this.machineIds, time.getTime());
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push('MachineDetailPage', { machineId: machine.id });
  }

  get hasDowntimeCodes() : boolean {
    return this.downtimeCodes != null && this.downtimeCodes[0].length > 0;
  }
}
