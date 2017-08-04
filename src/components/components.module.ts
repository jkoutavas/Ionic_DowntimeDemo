import { NgModule } from '@angular/core';
import { HealthGaugeComponent } from './health-gauge/health-gauge';
import { ClockComponent } from './clock/clock';
@NgModule({
	declarations: [HealthGaugeComponent,
    ClockComponent],
	imports: [],
	exports: [HealthGaugeComponent,
    ClockComponent]
})
export class ComponentsModule {}
