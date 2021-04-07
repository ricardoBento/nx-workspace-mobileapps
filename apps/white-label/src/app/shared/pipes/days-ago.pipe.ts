import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo',
})
export class DaysAgoPipe implements PipeTransform {
  transform(value, args?) {
    const now = new Date();
    const takenDate = new Date(value);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs((takenDate.getTime() - now.getTime()) / oneDay)
    );

    return diffDays;
  }
}
