import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DowntimeDetailPage } from '../../pages/downtime-detail/downtime-detail';

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
  private sub2: any;

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
    this.sub = this.dataProvider.overallHealth.subscribe(_ => {
      this.updateGraphs();
     });
  
    this.sub2 = this.dataProvider.selectedReportCriteria.subscribe(_ => {
      this.updateGraphs();
     });
  }

  updateGraphs() {
    this.downtimeReasons = this.dataProvider.gatherDowntimeReasons(this.machineIds, this.dataProvider.selectedReportCriteria.getValue());
    this.downtimeTrends = this.dataProvider.gatherDowntimeTrends(this.machineIds, this.dataProvider.selectedReportCriteria.getValue());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push('MachineDetailPage', { machineId: machine.id });
  }

  clickCallback() {
    this.navCtrl.push(DowntimeDetailPage, { title:this.factory.name, machineIds:this.machineIds });
  }
}
