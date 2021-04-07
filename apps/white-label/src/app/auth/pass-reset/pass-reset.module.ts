import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PassResetPage } from './pass-reset.page';
import { SharedModule } from '../../shared/shared.module';
import { PassResetPageRoutingModule } from './pass-reset-routing.module';
const routes: Routes = [
  {
    path: '',
    component: PassResetPage,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassResetPageRoutingModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [PassResetPage],
})
export class PassResetPageModule {}
