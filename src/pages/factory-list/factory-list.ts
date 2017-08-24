import { Component } from '@angular/core';

import { NavController, PopoverController} from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

import { MachineListPage } from '../machine-list/machine-list';
import { ReportListPage } from '../report-list/report-list';
import { FactoryDetailPage } from '../factory-detail/factory-detail';
import { ReportsPopoverComponent } from "../../components/reports-popover/reports-popover";

@Component({
  selector: 'page-factory-list',
  templateUrl: 'factory-list.html'
})
export class FactoryListPage {
  factories: any[] = [];

  constructor(
    private navCtrl: NavController,
    private downtimeData: DowntimeData,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    this.factories = this.downtimeData.getFactories();
  }

  goToMachineList(machineList: any) {
    this.navCtrl.push(MachineListPage, { machines: machineList, title: "Factories" });
  }

  goToFactoryDetail(factory: any) {
    this.navCtrl.push(FactoryDetailPage, { factoryId: factory.id });
  }

  presentPopover(ev:any) {
    let popover = this.popoverCtrl.create(ReportsPopoverComponent, {
    });
    popover.present({
      ev: ev
    });

    popover.onDidDismiss((popoverData) => {
      if( popoverData != null ) {
        this.navCtrl.push(ReportListPage, { title: "Factories: "+popoverData.name});
      }
    })
  }

 }
