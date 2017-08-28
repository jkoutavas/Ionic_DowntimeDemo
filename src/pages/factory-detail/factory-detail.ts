import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DowntimeData, DowntimeReasonsType, DowntimeTrendsType } from '../../providers/downtime-data';

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

  downtimeReasons: DowntimeReasonsType;
  downtimeTrends: DowntimeTrendsType;

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

  ionViewDidLoad() {
    let me = this;
    this.sub = this.dataProvider.overallHealth.subscribe(_ => {
      this.downtimeReasons = me.dataProvider.gatherDowntimeReasons(me.machineIds, me.dataProvider.selectedReportCriteria);
      this.downtimeTrends = me.dataProvider.gatherDowntimeTrends(me.machineIds, me.dataProvider.selectedReportCriteria);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push('MachineDetailPage', { machineId: machine.id });
  }
}
