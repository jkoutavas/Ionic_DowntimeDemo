import { NgModule } from '@angular/core';
import { HealthGaugeComponent } from './health-gauge/health-gauge';
import { ClockComponent } from './clock/clock';
import { EventsShuttleComponent } from './events-shuttle/events-shuttle';
import { Top5GraphComponent } from './top5-graph/top5-graph';
@NgModule({
	declarations: [HealthGaugeComponent,
    ClockComponent,
    EventsShuttleComponent,
    Top5GraphComponent],
	imports: [],
	exports: [HealthGaugeComponent,
    ClockComponent,
    EventsShuttleComponent,
    Top5GraphComponent]
})
export class ComponentsModule {}
