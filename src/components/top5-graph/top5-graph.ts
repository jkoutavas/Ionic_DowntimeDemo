import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DowntimeReasonsType } from '../../providers/downtime-data';

/**
 * Generated class for the Top5GraphComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'top5-graph',
  templateUrl: 'top5-graph.html'
})
export class Top5GraphComponent {
  
  private _downtimeCodes: DowntimeReasonsType; 
  @Input() 
    set downtimeCodes(downtimeCodes: DowntimeReasonsType) {
      this._downtimeCodes = downtimeCodes;
      this.updateGraph();
  }
  get downtimeCodes() {
    return this._downtimeCodes;
  }

  @Output() clickCallback = new EventEmitter<any>();
  
  private options: Object;
  private chart: any = null;

  ngOnInit() {
    this.options = { 
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Top Five Downtime Reasons'
      },
      xAxis: {
        categories: [],
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'occurances',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' events'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        cursor: 'pointer',
        colorByPoint: true,
        name: "Downtime",
        data: []
      }]
    }
  }

  ngAfterViewInit(): void {
    this.updateGraph();
  }
  
  updateGraph() {
    if( this.chart != undefined && this.downtimeCodes != undefined ) {
      this.chart.xAxis[0].categories = this.downtimeCodes.descriptions.slice(0,5);
      this.chart.series[0].setData(this.downtimeCodes.totals.slice(0,5), true, true);
      let colors = [];
      for( let isScheduled of this.downtimeCodes.isScheduled.slice(0,5) )
        colors.push(isScheduled==true?'#7cb5ec':"red");
      this.chart.series[0].update({colors:colors},true)
    }
  }

  saveInstance(chartInstance: any) {
    if( chartInstance != null ) {
      this.chart = chartInstance;
    }
  }

}
