import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {O2ChartComponent} from './app/o2chart/o2chart.component';
import {ChartConst} from './app/o2chart/shared/chart-const';

platformBrowserDynamic().bootstrapModule(AppModule);

export * from './app/o2chart/o2chart.component';
export * from './app/o2chart/shared/chart-const';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChartConst,
    O2ChartComponent
  ],
  exports: [
    O2ChartComponent
  ]
})
export default class O2ChartModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: O2ChartModule,
      providers: []
    };
  }
}