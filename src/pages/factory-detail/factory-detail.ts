import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

import { ReportListPage } from '../report-list/report-list';
import { ReportsPopoverComponent } from "../../components/reports-popover/reports-popover";

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

  constructor(
    private dataProvider: DowntimeData, 
    private navCtrl: NavController, 
    private navParams: NavParams,
    private popoverCtrl: PopoverController
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
      me.topDowntimeCodes = this.dataProvider.gatherDowntimeCodesForMachines(this.machineIds, time.getTime(), 5);
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

  presentPopover(ev:any) {
    let popover = this.popoverCtrl.create(ReportsPopoverComponent, {
    });
    popover.present({
      ev: ev
    });

    popover.onDidDismiss((popoverData) => {
      if( popoverData != null ) {
        this.navCtrl.push(ReportListPage, { title: this.factory.name+": "+popoverData.name});
      }
    })
  }
}
