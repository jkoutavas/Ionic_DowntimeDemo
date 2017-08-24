import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

/**
 * Generated class for the ReportListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-list',
  templateUrl: 'report-list.html',
})
export class ReportListPage {
  title: string = "";
  topDowntimeCodes: [string[], number[]];

  constructor(
    private navParams: NavParams,
    private downtimeData: DowntimeData
  ) {
  }

  ngOnInit() {
    this.title = this.navParams.data.title;
  }

  ionViewDidLoad() {
    this.topDowntimeCodes = this.downtimeData.gatherDowntimeCodesForMachines([], 0, 5);
  }

}
