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

  playIcon: string = "pause";
  togglePlay() {
    this.playIcon = this.downtimeData.togglePlay() ? "pause" : "play";
  }

  get day(): number {
    return this.downtimeData.day;
  }

  get days(): number {
    return this.downtimeData.days;
  }

  get start(): Date {
    return this.downtimeData.start;
  }

  get end(): Date {
    return this.downtimeData.end;
  }

  set day(value: number) {
    this.downtimeData.day = value;
  }

  rewind() {
    this.downtimeData.day = 0;
  }

  fastforward() {
  }

  isDate(date:Date) { return date && date.getTime() === date.getTime() }
}
