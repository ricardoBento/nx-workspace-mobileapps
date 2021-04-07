import { NgModule } from '@angular/core';
import { TrimHtmlPipe } from './trim-html.pipe';
import { TruncatePipe } from './truncate.pipe';
import { LocalDatePipe } from './local-date.pipe';
// import { StringToDatePipe } from './string-to-date.pipe';
import { DaysAgoPipe } from './days-ago.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { OrdinalPipe } from './ordinal.pipe';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TimeAgoPipe } from './time-ago-pipe';
import { TruncateTextPipe } from './truncate-text.pipe';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [
    TruncatePipe,
    TrimHtmlPipe,
    LocalDatePipe,
    // StringToDatePipe,
    DaysAgoPipe,
    CapitalizePipe,
    OrdinalPipe,
    TruncateTextPipe,
    TimeAgoPipe,
  ],
  exports: [
    TruncatePipe,
    TrimHtmlPipe,
    LocalDatePipe,
    // StringToDatePipe,
    DaysAgoPipe,
    CapitalizePipe,
    OrdinalPipe,
    TruncateTextPipe,
    TimeAgoPipe,
  ],
})
export class PipesModule {}
