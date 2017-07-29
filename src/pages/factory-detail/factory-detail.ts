import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';

@IonicPage({
  segment: 'factory/:factoryId'
})
@Component({
  selector: 'page-factory-detail',
  templateUrl: 'factory-detail.html'
})
export class FactoryDetailPage {
  factory: any;

  constructor(public dataProvider: ConferenceData, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      if (data && data.factories) {
        for (const factory of data.factories) {
          if (factory && factory.id === this.navParams.data.factoryId) {
            this.factory = factory;
            break;
          }
        }
      }
    });

  }

  goToSessionDetail(session: any) {
    this.navCtrl.push('SessionDetailPage', { sessionId: session.id });
  }
}
