import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingColor',
  standalone: false
})
export class RatingColorPipe implements PipeTransform {

  transform(r: number): string {
    if (r >= 8) return '#056b37';      // verde
    if (r >= 6) return '#f5c518';      // galben
    return '#d90c0c';                  // roșu
  }

}
