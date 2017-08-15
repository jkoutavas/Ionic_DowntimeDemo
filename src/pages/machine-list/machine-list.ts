import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,
  Config,
  NavController,
  NavParams
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
  title: string;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public downtimeData: DowntimeData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) {
    
  }

  ionViewDidLoad() {
    if( !this.navParams.data.machines ) {
      this.machines = this.downtimeData.getMachines();
    } else {
      this.machines = this.navParams.data.machines;
    }
    this.title = this.navParams.data.title || "Machines";
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push(MachineDetailPage, { machineId: machine.id });
  }

  goToFactoryDetail(factory: any) {
    this.navCtrl.push(FactoryDetailPage, { factoryId: factory.id });
  }

  downtime(machine: any): any {
    let e = this.downtimeData.getDowntimeEvents().find((e: any) => e.id == machine.downtimeEventId);
    return this.downtimeData.getDowntimeCodes().find((d: any) => d.codeId == e.codeId);
  }
  
}
