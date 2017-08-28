import { Component } from '@angular/core';

/**
 * Generated class for the ReportCriteriaComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'report-criteria',
  templateUrl: 'report-criteria.html'
})
export class ReportCriteriaComponent {

  text: string;

  constructor() {
    console.log('Hello ReportCriteriaComponent Component');
    this.text = 'Hello World';
  }

}
