import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: false,
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  @Input() averageRating: number = 0;
  @Input() ratingCount: number = 0;
  @Input() sectionTitle: string = 'Rating';
  @Input() userRating: number | null = null;
  @Input() starsCount: number = 10;
  @Input() smallHeader?: boolean;

  @Output() onRate = new EventEmitter<number>();

  stars: number[] = [];
  hoveredStarIndex: number | null = null;

  ngOnInit() {
    this.stars = Array(this.starsCount).fill(0).map((_, i) => i + 1);
  }

  rate(value: number) {
    this.userRating = value;
    this.hoveredStarIndex = null;
    this.onRate.emit(value);
  }

  getStarClass(i: number): string {
    const base = this.hoveredStarIndex ?? this.averageRating;

    if (i + 1 <= Math.floor(base)) return 'filled';
    if (i < base && base < i + 1) return 'half-filled';
    return '';
  }
}
