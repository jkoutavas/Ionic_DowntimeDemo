import { Component } from '@angular/core';

import { App, NavController, ModalController, ViewController } from 'ionic-angular';


@Component({
  template: `
    <ion-list>
      <button ion-item (click)="close('https://www.industrialintelligence.net/blogs/')">Blog</button>
      <button ion-item (click)="close('https://www.industrialintelligence.net/about-us/')">About Us</button>
      <button ion-item (click)="close('https://www.industrialintelligence.net/contact-us/')">Contact Us</button>
    </ion-list>
  `
})
export class PopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController
  ) { }

  close(url: string) {
    window.open(url, '_blank');
    this.viewCtrl.dismiss();
  }
}