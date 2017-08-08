import { Component } from '@angular/core';

import { DowntimeData } from '../../providers/downtime-data';

/**
 * Generated class for the ClockComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clock',
  templateUrl: 'clock.html',
 })

 export class ClockComponent {

  time: Date = new Date;
  
  constructor(private downtimeData: DowntimeData) {
  }

  ngOnInit() {
    this.downtimeData.getClock().subscribe(time => this.time = time);
  }
}
