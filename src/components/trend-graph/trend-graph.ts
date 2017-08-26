import { Component, Input } from '@angular/core';

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
        data: stats.scheduled
      }, false);
      this.chart.series[1].update({
        pointStart: stats.startDateUTC,
        data: stats.unplanned
      }, true);
    }
  }
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
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        series: {
          pointStart: Date.UTC(2017, 7, 1),
          pointInterval: 24 * 3600 * 1000
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "Scheduled",
        data: []
      }, {
        name: "Unplanned",
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
