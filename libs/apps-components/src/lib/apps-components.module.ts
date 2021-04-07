import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { NgxIonicImageViewerModule } from './components/ngx-ionic-image-viewer/src/public-api';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  imports: [CommonModule, IonicModule, PipesModule, NgxIonicImageViewerModule],
  // entryComponents: [MenuGridComponent],
  // declarations: [AppHeaderComponent, MenuGridComponent],
  exports: [AppHeaderComponent, PipesModule, NgxIonicImageViewerModule],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppsComponentsModule {}
