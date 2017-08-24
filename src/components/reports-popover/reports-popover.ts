import { Component } from '@angular/core';
import {ViewController} from 'ionic-angular';

/**
 * Generated class for the ReportsPopoverComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'reports-popover',
  templateUrl: 'reports-popover.html'
})
export class ReportsPopoverComponent {

  popoverItemList = [{name: 'Top-5 Downtime Reasons'}, {name: 'Downtime Trends'}, {name: 'Change Over Time'}];
  selectedItem:any = null;

  constructor(private viewCtrl: ViewController) {
  }

  setSelectedItem(selectedItem:any) {
    this.selectedItem = selectedItem;
    this.viewCtrl.dismiss(this.selectedItem);
  }

}
