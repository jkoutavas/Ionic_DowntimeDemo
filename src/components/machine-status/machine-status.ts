import { Component, Input } from '@angular/core';

import { DowntimeData } from '../../providers/downtime-data';

/**
 * Generated class for the MachineStatusComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'machine-status',
  templateUrl: 'machine-status.html'
})
export class MachineStatusComponent {

  @Input()
  set status(status:any) {
    if( status === undefined ) {
      return;
    }

    // compute maxiumum expected uptime (in seconds)
    //const time = this.downtimeData.getClock();
    let uptime : number = 0;
    let downtime : number = 0;
    for( const event of status.events ) {
      if( event.id && 
          !this.downtimeData.isScheduledDowntimeCodeId(event.codeId)) {
        downtime += event.endTime - event.startTime;
      }
      uptime += event.endTime - event.startTime;
    }

    const ratio = (uptime / (downtime + uptime));
    this.target = ""+status.machine.targetWeight;
    const actual = status.machine.targetWeight * ratio;
    this.actual = actual.toFixed(0);
    const percent = ratio * 100;
    this.efficiency = percent.toFixed(0);
    this.downtime = this.dhms(downtime/1000,'d:hh:mm:ss');
  }

  target: string;
  actual: string;
  efficiency: string;
  downtime: string;

  constructor(private downtimeData: DowntimeData) {
  }

  dhms(s:number, f:string) {
    let d=0;
    let h=0;
    let m=0;
    switch (true) {
    case (s>86400):
      d=Math.floor(s/86400);
      s-=d*86400;
    case (s>3600):
      h=Math.floor(s/3600);
      s-=h*3600;
    case (s>60):
      m=Math.floor(s/60);
      s-=m*60;
    }
    s = Math.round(s);
    if (f != null) {
      let ds = d.toString();
      let hs = h.toString();
      let ms = m.toString();
      let ss = s.toString();
      f = f.replace('dd', (d<10)?"0"+ds:ds);
      f = f.replace('d', ds);
      f = f.replace('hh', (h<10)?"0"+hs:hs);
      f = f.replace('h', hs);
      f = f.replace('mm', (m<10)?"0"+ms:ms);
      f = f.replace('m', ms);
      f = f.replace('ss', (s<10)?"0"+ss:ss);
      f = f.replace('s', ss);
    } 
    else {
      f = d + ':' + h + ':' + m + ':' + s;
    }
    return f;
  }

}
