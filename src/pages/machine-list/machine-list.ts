import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,
  Config,
  NavController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { DowntimeData } from '../../providers/downtime-data';

import { MachineDetailPage } from '../machine-detail/machine-detail';
import { FactoryDetailPage } from '../factory-detail/factory-detail';

// TODO remove
export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean|void;
};

@Component({
  selector: 'page-machine-list',
  templateUrl: 'machine-list.html'
})
export class MachineListPage {
  actionSheet: ActionSheet;
  machines: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public downtimeData: DowntimeData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) {}

  ionViewDidLoad() {
    this.downtimeData.getMachines().subscribe((machines: any[]) => {
      this.machines = machines;
    });
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push(MachineDetailPage, { machineId: machine.id });
  }

    goToFactoryDetail(factory: any) {
    this.navCtrl.push(FactoryDetailPage, { factoryId: factory.id });
  }

}
