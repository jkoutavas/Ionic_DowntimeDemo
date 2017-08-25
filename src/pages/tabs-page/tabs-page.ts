import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { MachineListPage } from '../machine-list/machine-list';
import { FactoryListPage } from '../factory-list/factory-list';
import { CompanyDetailPage } from '../company-detail/company-detail';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = MapPage;
  tab2Root: any = CompanyDetailPage;
  tab3Root: any = FactoryListPage;
  tab4Root: any = MachineListPage;
  tab5Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
