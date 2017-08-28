import { Component } from '@angular/core';

import { DowntimeData, CriteriaEnum } from '../../providers/downtime-data';

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

  constructor(private downtimeData: DowntimeData) {
  }

  get criteria(): any[] {
    return this.downtimeData.reportCriteria;
  }

  get selectedCriteria(): CriteriaEnum {
    return this.downtimeData.selectedReportCriteria.getValue();
  }

  valueChanged(value:CriteriaEnum)
  {
    this.downtimeData.selectedReportCriteria.next(Number(value));
  }

}
