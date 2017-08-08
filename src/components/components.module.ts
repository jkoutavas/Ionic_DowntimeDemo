import { NgModule } from '@angular/core';
import { HealthGaugeComponent } from './health-gauge/health-gauge';
import { ClockComponent } from './clock/clock';
import { EventsShuttleComponent } from './events-shuttle/events-shuttle';
@NgModule({
	declarations: [HealthGaugeComponent,
    ClockComponent,
    EventsShuttleComponent],
	imports: [],
	exports: [HealthGaugeComponent,
    ClockComponent,
    EventsShuttleComponent]
})
export class ComponentsModule {}
