import { Component } from '@angular/core';

import { ClockProvider } from '../../providers/clock/clock';

/**
 * Generated class for the ClockComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clock',
  templateUrl: 'clock.html'
})
export class ClockComponent {

  time: Date;

  constructor(private clockProvider: ClockProvider) {
    this.clockProvider.getClock().subscribe(time => this.time = time);
  }

  startClock() {
    this.clockProvider.start();
  }

  stopClock() {
    this.clockProvider.stop();
  }

}
