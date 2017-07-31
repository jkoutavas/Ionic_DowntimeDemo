import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,
  ActionSheetOptions,
  Config,
  NavController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { DowntimeData } from '../../providers/downtime-data';

import { MachineDetailPage } from '../machine-detail/machine-detail';
import { FactoryDetailPage } from '../factory-detail/factory-detail';

// TODO remove
export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean|void;
};

@Component({
  selector: 'page-machine-list',
  templateUrl: 'machine-list.html'
})
export class MachineListPage {
  actionSheet: ActionSheet;
  machines: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public downtimeData: DowntimeData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) {}

  ionViewDidLoad() {
    this.downtimeData.getMachines().subscribe((machines: any[]) => {
      this.machines = machines;
    });
  }

  goToMachineDetail(machine: any) {
    this.navCtrl.push(MachineDetailPage, { machineId: machine.id });
  }

    goToFactoryDetail(factory: any) {
    this.navCtrl.push(FactoryDetailPage, { factoryId: factory.id });
  }

  goToMachineTwitter(machine: any) {
    this.inAppBrowser.create(
      `https://twitter.com/${machine.twitter}`,
      '_blank'
    );
  }

  openMachineShare(machine: any) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + machine.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log('Copy link clicked on https://twitter.com/' + machine.twitter);
            if ( (window as any)['cordova'] && (window as any)['cordova'].plugins.clipboard) {
              (window as any)['cordova'].plugins.clipboard.copy(
                'https://twitter.com/' + machine.twitter
              );
            }
          }
        } as ActionSheetButton,
        {
          text: 'Share via ...'
        } as ActionSheetButton,
        {
          text: 'Cancel',
          role: 'cancel'
        } as ActionSheetButton
      ]
    } as ActionSheetOptions);

    actionSheet.present();
  }

  openContact(machine: any) {
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + machine.name,
      buttons: [
        {
          text: `Email ( ${machine.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + machine.email);
          }
        } as ActionSheetButton,
        {
          text: `Call ( ${machine.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + machine.phone);
          }
        } as ActionSheetButton
      ]
    } as ActionSheetOptions);

    actionSheet.present();
  }
}
