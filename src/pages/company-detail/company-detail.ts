import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { DowntimeData, DowntimeReasonsType, DowntimeTrendsType } from '../../providers/downtime-data';

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

  downtimeReasons: DowntimeReasonsType;
  downtimeTrends: DowntimeTrendsType;

  private sub: any;

  constructor(private downtimeData: DowntimeData) {
  }

  ionViewDidLoad() {
    this.title = this.downtimeData.getCompany().name;
    this.sub = this.downtimeData.overallHealth.subscribe(_ => {
      this.downtimeReasons = this.downtimeData.gatherDowntimeReasons([], this.downtimeData.selectedReportCriteria);
      this.downtimeTrends = this.downtimeData.gatherDowntimeTrends([], this.downtimeData.selectedReportCriteria);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
