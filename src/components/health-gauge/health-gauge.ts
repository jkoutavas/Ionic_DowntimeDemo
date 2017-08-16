import { Component, Input } from '@angular/core';

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

  private _value: number = 0;
  private options: Object;
  private chart: any;

  @Input() max: number = 1;
  
  @Input()
  get value():number {
    return this._value;
  }
  set value(v:number) {
    this._value = v;
    if( this.chart ) {
      this.chart.series[0].name = String(this.max);
      this.chart.series[0].setData([this.value], true, true);
    }
  }
  
  ngOnInit() {
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
        visible: false,
        min: 0,
        max: this.max,
        stops: [
            [0.2, '#FF0000'], // red
            [0.8, '#DDDF0D'], // yellow
            [1.0, '#55BF3B'] // green
        ],
        lineWidth: 0,
        title: {
          y: -70
        },
        labels: {
          y: 16
        },
      },

      series: [{
        name: Number(this.max),
        data: [Number(this.value)],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:18px;color:' +
            ('black') + '">{y}/{series.name}</span><br/>'
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
    if( this.chart == null ) {
      this.chart = chartInstance;
    }
  }

};
