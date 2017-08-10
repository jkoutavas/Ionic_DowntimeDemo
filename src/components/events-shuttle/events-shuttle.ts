import { Component } from '@angular/core';

import { DowntimeData } from '../../providers/downtime-data';

/**
 * Generated class for the EventsShuttleComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'events-shuttle',
  templateUrl: 'events-shuttle.html'
})
export class EventsShuttleComponent {

  constructor(private downtimeData: DowntimeData) {
  }

  playIcon: string = "pause";
  togglePlay() {
    this.playIcon = this.downtimeData.togglePlay() ? "pause" : "play";
  }

  get eventIdx(): number {
    return this.downtimeData.eventIdx+1;
  }

  get eventCount(): number {
    return this.downtimeData.eventCount;
  }

  set eventIdx(value: number) {
    this.downtimeData.eventIdx = value-1;
  }

  goBack() {
    this.downtimeData.eventIdx = this.downtimeData.eventIdx-1;
  }

  goForward() {
    this.downtimeData.eventIdx = this.downtimeData.eventIdx+1;
  }

  isDate(date:Date) { 
    return date && date.getTime() === date.getTime() 
  }
  
  get isBackDisabled() {
    return this.downtimeData.eventIdx == 0;
  }

  get isForwardDisabled() {
    return this.downtimeData.eventIdx == this.downtimeData.eventCount-1;
  }

  get start() : Date {
    return this.downtimeData.startDate;
  }

  get end() : Date {
    return this.downtimeData.endDate;
  }

}
