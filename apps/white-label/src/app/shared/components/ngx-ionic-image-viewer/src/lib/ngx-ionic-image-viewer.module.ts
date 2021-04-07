import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { NgxIonicImageViewerComponent } from './ngx-ionic-image-viewer.component';
import { NgxIonicImageViewerDirective } from './ngx-ionic-image-viewer.directive';
import { ViewerModalComponent } from './viewer-modal/viewer-modal.component';

@NgModule({
  declarations: [
    NgxIonicImageViewerComponent,
    NgxIonicImageViewerDirective,
    ViewerModalComponent,
  ],
  imports: [CommonModule, IonicModule],
  entryComponents: [ViewerModalComponent],
  exports: [
    NgxIonicImageViewerComponent,
    NgxIonicImageViewerDirective,
    ViewerModalComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class NgxIonicImageViewerModule {}
