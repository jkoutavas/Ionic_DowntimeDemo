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

  get eventIdx(): number {
    return this.downtimeData.eventIdx+1;
  }

  get eventCount(): number {
    return this.downtimeData.eventCount;
  }

  get start(): Date {
    return this.downtimeData.start;
  }

  get end(): Date {
    return this.downtimeData.end;
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
}
