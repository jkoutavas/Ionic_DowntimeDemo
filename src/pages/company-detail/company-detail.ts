import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { DowntimeData, DowntimeReasonsType } from '../../providers/downtime-data';

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
  downtimeCodes: DowntimeReasonsType;
  private sub: any;

  constructor(private downtimeData: DowntimeData) {
  }

  ngOnInit() {
    this.title = this.downtimeData.getCompany().name;
    let me = this;
    this.sub = this.downtimeData.getClock().subscribe(time => {
      me.downtimeCodes = this.downtimeData.gatherDowntimeReasons([], time.getTime());
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
