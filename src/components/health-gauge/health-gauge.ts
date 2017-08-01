import { Component } from '@angular/core';

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
export class HealthGaugeComponent {

  constructor() {
    this.options = { 
      chart: {
        type: 'solidgauge'
      },

      title: "",
      
      pane: {
        center: ['50%', '50%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
    },

    credits: false,
    
    tooltip: {
      enabled: false
    },

    // the value axis
    yAxis: {
      min: 0,
      max: 3,
      stops: [
          [0.3, '#FF0000'], // red
          [0.7, '#DDDF0D'], // yellow
          [1.0, '#55BF3B'] // green
      ],
      lineWidth: 0,
      minorTickInterval: null,
//      tickAmount: 2,
      title: {
        y: -70
      },
      labels: {
        y: 16
      },
      
      minorTickLength: 0,
    },

    series: [{
      name: 'Health',
      data: [Math.floor(Math.random()*4)],
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ('black') + '">{y}</span><br/>'
      }
    }],

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  }
}

saveInstance(chartInstance: any) {
  this.chart = chartInstance;
}

  options: Object;
  chart: Object;
};
