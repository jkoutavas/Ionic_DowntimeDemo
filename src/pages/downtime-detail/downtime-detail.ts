import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { DowntimeData, DayRangeType } from '../../providers/downtime-data';
import { DateRendererComponent } from '../../components/date-renderer/date-renderer';

/**
 * Generated class for the DowntimeDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-downtime-detail',
  templateUrl: 'downtime-detail.html',
})
export class DowntimeDetailPage {

  tableSettings = {
    noDataMessage: 'Loading data...',
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager: {
      perPage: 100
    },
    columns: {
      startTime: {
        title: 'Start Time',
        filter: false,
        editable: false,
        sortDirection: 'asc',
        type: 'custom', // it's custom because we sort by numeric value but display a string
        renderComponent: DateRendererComponent
      },
      duration: {
        title: 'Duration',
        filter: false,
        editable: false
      },
      reason: {
        title: 'Reason',
        filter: false,
        editable: false
      },
      machine: {
        title: 'Machine',
        filter: false,
        editable: false
      },
      factory: {
        title: 'Factory',
        filter: false,
        editable: false
      }
    }
  };

  dataSource: any[] = [];

  private sub:any;

  constructor( private navParams: NavParams, private downtimeData: DowntimeData) 
  {
  }

 ionViewDidLoad() {
    this.sub = this.downtimeData.selectedReportCriteria.subscribe(_ => {
      this.updateGraphs();
     });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get title() {
    return this.navParams.data.title;
  }
  
  updateGraphs() {
    const dayRange:DayRangeType = this.downtimeData.getDayRange(this.downtimeData.selectedReportCriteria.getValue());
    const events = this.downtimeData.gatherEvents(this.navParams.data.machineIds, dayRange, false);
    let dataSource = [];
    for( let event of events ) {
      const machine = this.downtimeData.getMachines().find((m: any) => m.id == event.machineId);
      const factory = this.downtimeData.getFactories().find((f: any) => f.id == machine.factoryId);
      const reason = this.downtimeData.getDowntimeCodes().find((c: any) => c.codeId == event.codeId);
      dataSource.push({
        'startTime': event.startTime,
        'duration': this.getDuration(event.endTime-event.startTime),
        'reason': reason.description,
        'machine': machine.name,
        'factory': factory.name
       });
      }
      this.dataSource = dataSource;
  }

  formatTime(integer:number): any {
    if(integer < 10) {
        return "0" + integer; 
    } else {
        return integer;
    }
  }

  getDuration(ms:number) {
    var s1 = Math.floor(ms/1000);
    var m1 = Math.floor(s1/60);
    var m2 = m1%60;
    var h1 = Math.floor(m1/60);
    var string = this.formatTime(h1) +":" + this.formatTime(m2);
    return string;
  }

}
