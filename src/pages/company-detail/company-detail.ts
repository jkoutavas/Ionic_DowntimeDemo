import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { DowntimeData } from '../../providers/downtime-data';

/**
 * Generated class for the CompanyDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-company-detail',
  templateUrl: 'company-detail.html',
})
export class CompanyDetailPage {
  title: string = "";
  topDowntimeCodes: [string[], number[]];

  constructor(private downtimeData: DowntimeData) {
  }

  ngOnInit() {
    this.title = this.downtimeData.getCompany().name;
  }

  ionViewDidLoad() {
    this.topDowntimeCodes = this.downtimeData.gatherDowntimeCodesForMachines([], 0, 5);
  }

}
