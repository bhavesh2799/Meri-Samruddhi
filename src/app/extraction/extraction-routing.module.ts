import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtractionPage } from './extraction.page';

const routes: Routes = [
  {
    path: '',
    component: ExtractionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtractionPageRoutingModule {}
