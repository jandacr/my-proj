import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { O2chartComponent } from './o2chart/o2chart.component';

@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    HttpModule
     ],
  declarations: [ 
    AppComponent,
    O2chartComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
