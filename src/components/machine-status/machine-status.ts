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

  @Input() machine:any;
  
  target: string;
  actual: string;
  efficiency: string;
  downtime: string;
 
  constructor(private downtimeData: DowntimeData) {
  }

  ngOnInit() {
    let me = this;
    this.downtimeData.getClock().subscribe(time => {

      // compute maxiumum expected uptime (in seconds)
      let uptime : number = 0;
      let downtime : number = 0;
      const events = this.downtimeData.getDowntimeEvents().filter(function(event:any){
        return event.machineId == me.machine.id;
      });
      for( const event of events ) {
        if( event ) {
          if( event.startTime < time &&
              event.id && 
              event.codeId != 15864 /* scheduled downtime*/ && 
              event.codeId != 16024 /* end of shift */ ) {
            downtime += event.endTime - event.startTime;
          }
          uptime += event.endTime - event.startTime;
        }
      }
  
      const ratio = (uptime / (downtime + uptime));
      me.target = ""+me.machine.targetWeight;
      const actual = me.machine.targetWeight * ratio;
      me.actual = actual.toFixed(0);
      const percent = ratio * 100;
      me.efficiency = percent.toFixed(0);
      me.downtime = this.dhms(downtime/1000,'d:hh:mm:ss');     
    });
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
