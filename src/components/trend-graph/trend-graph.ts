import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DowntimeTrendsType } from '../../providers/downtime-data';

/**
 * Generated class for the TrendGraphComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'trend-graph',
  templateUrl: 'trend-graph.html'
})
export class TrendGraphComponent {

  private _downtimeTrends: DowntimeTrendsType; 
  @Input() 
    set downtimeTrends(downtimeTrends: DowntimeTrendsType) {
      this._downtimeTrends = downtimeTrends;
      this.updateGraph();
  }
  get downtimeTrends() {
    return this._downtimeTrends;
  }

  @Output() clickCallback = new EventEmitter<any>();

  private options: Object;
  private chart: any = null;

  ngOnInit() {
    this.options = { 
      title: {
        text: 'Downtime Trends'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Hours'
        }
      },
      plotOptions: {
        series: {
          pointStart: Date.UTC(2017, 7, 1),
          pointInterval: 0
        }
      },
      tooltip: {
        valueSuffix: ' hours'
      },
      credits: {
        enabled: false
      },
      series: [{
        cursor: 'pointer',
        name: "Scheduled",
        data: []
      }, {
        name: "Unplanned",
        color: "red",
        data: []
      }, {
        name: "Uptime",
        color: "green",
        data: []
      }]
    }
  }

  ngAfterViewInit(): void {
    this.updateGraph();
  }
  
  updateGraph() {
    if( this.chart != undefined && this.downtimeTrends != undefined ) {
      this.chart.series[0].update({
        pointStart: this.downtimeTrends.startDateUTC,
        data: this.downtimeTrends.scheduled,
        pointInterval: this.downtimeTrends.interval
      }, true);
      this.chart.series[1].update({
        pointStart: this.downtimeTrends.startDateUTC,
        data: this.downtimeTrends.unplanned,
        pointInterval: this.downtimeTrends.interval
      }, true);
      this.chart.series[2].update({
        pointStart: this.downtimeTrends.startDateUTC,
        data: this.downtimeTrends.uptime,
        pointInterval: this.downtimeTrends.interval
      }, true);
    }
  }

  saveInstance(chartInstance: any) {
    if( chartInstance != null ) {
      this.chart = chartInstance;
    }
  }
}
