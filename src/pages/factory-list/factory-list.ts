import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

import { MachineListPage } from '../machine-list/machine-list';
import { FactoryDetailPage } from '../factory-detail/factory-detail';

@Component({
  selector: 'page-factory-list',
  templateUrl: 'factory-list.html'
})
export class FactoryListPage {
  factories: any[] = [];

  constructor(
    private navCtrl: NavController,
    private downtimeData: DowntimeData
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
 }
