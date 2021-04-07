import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { MenuGridComponent } from './components/menu-grid/menu-grid.component';
import { PipesModule } from './pipes/pipes.module';
import { NgxIonicImageViewerModule } from './components/ngx-ionic-image-viewer/src/public-api';
import { FanMenuModule } from './components/fan-menu/menu.module';
// import { IonFanComponent } from './components/ion-fan/ion-fan.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    NgxIonicImageViewerModule,
    FanMenuModule,
  ],
  entryComponents: [
    MenuGridComponent,
    // IonFanComponent
  ],
  declarations: [AppHeaderComponent, MenuGridComponent],
  exports: [
    AppHeaderComponent,
    MenuGridComponent,
    PipesModule,
    NgxIonicImageViewerModule,
    // IonFanComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
