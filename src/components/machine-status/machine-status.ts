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
  set machine(m:any) {
    
    // compute maxiumum expected uptime (in seconds)
    let uptime : number = 0;

    let downtime : number = 0;
    const events = this.downtimeData.getDowntimeEvents().filter(function(event:any){
      return event.machineId == m.id;
    });
    for( const event of events ) {
      if( event ) {
        if( event.id && event.codeId != 15864 /* scheduled downtime*/ && event.codeId != 16024 /* end of shift */ ) {
          downtime += event.endTime - event.startTime;
        } else {
          if( uptime + (event.endTime - event.startTime) < 0 ) {
            console.log("foo");
          }

          uptime += event.endTime - event.startTime;

        }
      }
    }

    const percent = (uptime / (downtime + uptime)) * 100;
    this.text = "Availability: " + percent.toFixed(2) + "%";
  }

  text: string;

  constructor(private downtimeData: DowntimeData) {
  }

}
