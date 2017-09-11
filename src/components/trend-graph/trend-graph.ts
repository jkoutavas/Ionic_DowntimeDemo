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
  @Input()
  set downtimeTrends(stats:DowntimeTrendsType) {
    if( this.chart ) {
      this.chart.series[0].update({
        pointStart: stats.startDateUTC,
        data: stats.scheduled,
        pointInterval: stats.interval
      }, true);
      this.chart.series[1].update({
        pointStart: stats.startDateUTC,
        data: stats.unplanned,
        pointInterval: stats.interval
      }, true);
      this.chart.series[2].update({
        pointStart: stats.startDateUTC,
        data: stats.uptime,
        pointInterval: stats.interval
      }, true);
    }
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

  saveInstance(chartInstance: any) {
    if( this.chart == null ) {
      this.chart = chartInstance;
    }
  }
}
