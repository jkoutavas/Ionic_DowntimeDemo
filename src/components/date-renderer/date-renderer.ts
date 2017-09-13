import { Component, Input } from '@angular/core';

/**
 * Generated class for the DateRendererComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'date-renderer',
  template: '{{renderedValue}}'
})
export class DateRendererComponent {

  renderedValue: string;

  @Input() value: Date;
  @Input() rowData: any;

  ngOnInit() {
    this.renderedValue = new Date(this.value).toLocaleTimeString("en-us", {  
      year: "numeric", month: "short",  
      day: "numeric", hour: "2-digit", minute: "2-digit"  
    });
  }
}
