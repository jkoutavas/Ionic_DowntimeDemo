import { Component } from '@angular/core';

import {
  Config,
  NavController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    public navCtrl: NavController,
    public downtimeData: DowntimeData,
    public config: Config,
    public inAppBrowser: InAppBrowser
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
