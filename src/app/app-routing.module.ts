import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapSettingsComponent } from './map-settings/map-settings.component';

const routes: Routes = [
  { path: 'settings', component: MapSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
