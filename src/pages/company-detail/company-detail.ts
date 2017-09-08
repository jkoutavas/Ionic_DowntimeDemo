import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { DowntimeDetailPage } from '../../pages/downtime-detail/downtime-detail';

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
  private sub2: any;

  constructor(private downtimeData: DowntimeData, private navCtrl: NavController) {
  }

  ionViewDidLoad() {
    this.title = this.downtimeData.getCompany().name;
    this.sub = this.downtimeData.overallHealth.subscribe(_ => {
      this.updateGraphs();
    });

    this.sub2 = this.downtimeData.selectedReportCriteria.subscribe(_ => {
      this.updateGraphs();
     });
  }

  updateGraphs() {
    this.downtimeReasons = this.downtimeData.gatherDowntimeReasons([], this.downtimeData.selectedReportCriteria.getValue());
    this.downtimeTrends = this.downtimeData.gatherDowntimeTrends([], this.downtimeData.selectedReportCriteria.getValue());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  clickCallback() {
    this.navCtrl.push(DowntimeDetailPage, { title:this.title, machineIds:[] });
  }
}
