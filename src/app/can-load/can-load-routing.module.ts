import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanLoadComponent } from './can-load/can-load.component';
import { CanLoadExample1Component } from './can-load-example-1/can-load-example-1.component';

const routes: Routes = [{
  path: '',
  component: CanLoadComponent,
  children: [
    {
      path: 'can-load-example-1',
      component: CanLoadExample1Component,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanLoadRoutingModule {}
