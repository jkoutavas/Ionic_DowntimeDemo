import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { DemoApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MachineDetailPage } from '../pages/machine-detail/machine-detail';
import { MachineListPage } from '../pages/machine-list/machine-list';
import { SignupPage } from '../pages/signup/signup';
import { FactoryDetailPage } from '../pages/factory-detail/factory-detail';
import { FactoryListPage } from '../pages/factory-list/factory-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { DowntimeData } from '../providers/downtime-data';
import { UserData } from '../providers/user-data';

import { ChartModule } from 'angular2-highcharts';

import { ClockComponent } from '../components/clock/clock';
import { EventsShuttleComponent } from '../components/events-shuttle/events-shuttle';
import { HealthGaugeComponent } from '../components/health-gauge/health-gauge';
import { Top5GraphComponent } from '../components/top5-graph/top5-graph';
import { MachineStatusComponent } from '../components/machine-status/machine-status';

declare var require : any; // need for the ChartModule import

export function startupServiceFactory(startupService: DowntimeData): Function {
    return () => startupService.load();
}

@NgModule({
  declarations: [
    DemoApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    MachineDetailPage,
    MachineListPage,
    SignupPage,
    FactoryDetailPage,
    FactoryListPage,
    TabsPage,
    TutorialPage,
    HealthGaugeComponent,
    ClockComponent,
    EventsShuttleComponent,
    Top5GraphComponent,
    MachineStatusComponent
  ],
  imports: [
    BrowserModule,
    ChartModule.forRoot(require('highcharts'),
      require('highcharts/highcharts-more'),
      require('highcharts/modules/solid-gauge')),
    HttpModule,
    IonicModule.forRoot(DemoApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: MachineListPage, name: 'MachineList', segment: 'machineList' },
        { component: MachineDetailPage, name: 'MachineDetail', segment: 'machineDetail/:machineId' },
        { component: FactoryListPage, name: 'FactoryList', segment: 'factoryList' },
        { component: FactoryDetailPage, name: 'FactoryDetail', segment: 'factoryDetail/:factoryId' },
        { component: MapPage, name: 'Map', segment: 'map' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DemoApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    MachineDetailPage,
    MachineListPage,
    SignupPage,
    FactoryDetailPage,
    FactoryListPage,
    TabsPage,
    TutorialPage
   ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DowntimeData,
    UserData,
    InAppBrowser,
    SplashScreen,

     {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [DowntimeData],
      multi: true
    }
  ]
})
export class AppModule { }
