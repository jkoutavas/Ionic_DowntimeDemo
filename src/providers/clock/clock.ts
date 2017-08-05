import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the ClockProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class ClockProvider {
  public playing: boolean = true;

  private clock: Observable<Date>;
  
  private startingDate: Date = new Date();
  private ticks: number = 1;

  constructor() {
    this.clock = Observable.interval(1000).map(_ => this.incrementDate()).share();
  }

  incrementDate(): Date {
    if( this.playing ) {
      this.startingDate = new Date(this.startingDate.getTime() + 1000*this.ticks);
    }

    return this.startingDate;
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

  setStartingDate(date: Date) {
    this.startingDate = date;
  }
  
  togglePlay() : boolean {
    this.playing = !this.playing;

    return this.playing;
  }

}
