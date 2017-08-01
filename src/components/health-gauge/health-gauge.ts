import { Component, OnInit, ViewChild } from '@angular/core';

import * as Highcharts from 'highcharts';


/**
 * Generated class for the HealthGaugeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'health-gauge',
  templateUrl: 'health-gauge.html'
})
export class HealthGaugeComponent implements OnInit {

  @ViewChild('container') chartContainer: any;

  constructor() {
  }

  ngOnInit(): void {

    Highcharts.chart(this.chartContainer.nativeElement, {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Fruit Consumption'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: [{
        name: 'Jane',
        data: [1, 0, 4]
      }, {
        name: 'John',
        data: [5, 7, 3]
      }]
    });
  }
}
