import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { IdeComponent } from './systems/components/ide/ide.component';

@NgModule({
  declarations: [
    IdeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [IdeComponent]
})
export class AppModule { }
