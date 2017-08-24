import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { MachineListPage } from '../machine-list/machine-list';
import { FactoryListPage } from '../factory-list/factory-list';
import { ReportListPage } from '../report-list/report-list';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = MapPage;
  tab2Root: any = FactoryListPage;
  tab3Root: any = MachineListPage;
  tab4Root: any = ReportListPage;
  tab5Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
