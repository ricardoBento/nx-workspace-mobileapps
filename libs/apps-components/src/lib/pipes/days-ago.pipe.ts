import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo',
})
export class DaysAgoPipe implements PipeTransform {
  transform(value, args?) {
    let now = new Date();
    let takenDate = new Date(value);
    let oneDay = 24 * 60 * 60 * 1000;
    let diffDays = Math.round(
      Math.abs((takenDate.getTime() - now.getTime()) / oneDay)
    );

    return diffDays;
  }
}
