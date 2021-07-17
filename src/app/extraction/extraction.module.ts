import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtractionPageRoutingModule } from './extraction-routing.module';

import { ExtractionPage } from './extraction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtractionPageRoutingModule
  ],
  declarations: [ExtractionPage]
})
export class ExtractionPageModule {}
