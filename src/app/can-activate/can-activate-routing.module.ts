import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateComponent } from './can-activate/can-activate.component';
import { CanActivateExample1Component } from './can-activate-example-1/can-activate-example-1.component';

const routes: Routes = [{
  path: '',
  component: CanActivateComponent,
  children: [
    {
      path: 'can-activate-example-1',
      component: CanActivateExample1Component,
     } 
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanActivateRoutingModule { }
