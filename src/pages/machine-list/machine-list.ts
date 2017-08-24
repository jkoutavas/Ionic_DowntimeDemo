import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

import { MachineDetailPage } from '../machine-detail/machine-detail';
import { FactoryDetailPage } from '../factory-detail/factory-detail';


@Component({
  selector: 'page-machine-list',
  templateUrl: 'machine-list.html'
})
export class MachineListPage {
  machines: any[] = [];
  title: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private downtimeData: DowntimeData
  ) {
    
  }

  ngOnInit() {
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
    const e = this.downtimeData.getDowntimeEvents().find((e: any) => e.id == machine.downtimeEventId);
    return this.downtimeData.getDowntimeCodes().find((d: any) => d.codeId == e.codeId);
  }
  
}
