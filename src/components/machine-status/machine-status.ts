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
  
  text: string;

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
  
      const percent = (uptime / (downtime + uptime)) * 100;
      me.text = "Availability: " + percent.toFixed(2) + "%";    
    });
  }
}
