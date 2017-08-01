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
        center: ['20%', '20%'],
        size: '40%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
    },

    tooltip: {
      enabled: false
    },

    // the value axis
    yAxis: {
      stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        y: -70
      },
      labels: {
        y: 16
      }
    },

    series: [{
      name: 'Speed',
      data: [80],
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ('black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">km/h</span></div>'
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

  options: Object;
};
