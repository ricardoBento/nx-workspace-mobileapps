// how to use is:
// <div *ngFor="let item of items; let i = index">
//     <p>Pick your {{ i + 1 | ordinal }} photo</p>
// </div>

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ordinal' })
export class OrdinalPipe implements PipeTransform {
  transform(int) {
    const ones = +int % 10,
      tens = (+int % 100) - ones;
    return int + ['th', 'st', 'nd', 'rd'][tens === 10 || ones > 3 ? 0 : ones];
  }
}
