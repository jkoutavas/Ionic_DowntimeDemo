import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DowntimeDetailPage } from '../../pages/downtime-detail/downtime-detail';
import { MachineDetailPage } from '../../pages/machine-detail/machine-detail';

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

  tableSettings = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    rowClassFunction: (row:any) => { return row.index%2==0 ? 'rowStyle' : ''; },
    columns: {
      machineName: {
        title: 'Machine',
        filter: false,
        editable: false,
        sortDirection: 'asc',
        width: '20%'
      },
      status: {
        title: 'Current Status',
        filter: false,
        editable: false,
        type: 'html',
        valuePrepareFunction: (value:any) => { return "<img 'width=32' height=32' src='assets/img/md-thumbs-"+value+".svg'>" }
      }
    }
  };

  dataSource: any[] = [];

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
    let dataSource:any[] = [];
    this.factory.machines.forEach((machine: any) => {
      dataSource.push(
        {
          machineName: machine.name,
          status: machine.downtimeEventId==0 ? "up" : "down"
        });
    });
    this.dataSource = dataSource;

    this.downtimeReasons = this.dataProvider.gatherDowntimeReasons(this.machineIds, this.dataProvider.selectedReportCriteria.getValue());
    this.downtimeTrends = this.dataProvider.gatherDowntimeTrends(this.machineIds, this.dataProvider.selectedReportCriteria.getValue());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  gotoMachineDetails(event:any) {
    const machine = this.factory.machines.find((m:any) => m.name = event.data.machineName);
    this.navCtrl.push(MachineDetailPage, { machineId: machine.id });
  }

  gotoDowntimeDetails() {
    this.navCtrl.push(DowntimeDetailPage, { title:this.factory.name, machineIds:this.machineIds });
  }
}
