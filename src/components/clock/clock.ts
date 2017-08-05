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
  start: Date;
  end: Date;
  _day: number = -60;
  days: number = -60;

  constructor(private clockProvider: ClockProvider) {
    this.end = new Date;
    this.start = new Date();
    this.start.setDate(this.start.getDate()+this.days);
    this.clockProvider.setStartingDate(this.start);
    this.clockProvider.getClock().subscribe(time => this.time = time);
  }

  playIcon: string = "pause";

  togglePlay() {
    this.playIcon = this.clockProvider.togglePlay() ? "pause" : "play";
  }

  get day(): number {
    return this._day;
  }

  set day(value: number) {
    this._day = value;

    var date: Date = new Date();
    date.setDate(this.end.getDate()+this._day);
    this.clockProvider.setStartingDate(date);
  }
}
