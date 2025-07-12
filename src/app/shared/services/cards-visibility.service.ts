import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardsVisibilityService {
  constructor() {}
  getCardsPerRowAndVisibleRows(container: HTMLElement, cardSelector: string): { cardsPerRow: number; visibleRows: number } {
    const cards = container.querySelectorAll(cardSelector);
    if (cards.length === 0) return { cardsPerRow: 0, visibleRows: 0 };

    const firstCardTop = (cards[0] as HTMLElement).offsetTop;
    let currentRowTop = firstCardTop;
    let cardsInCurrentRow = 0;
    const cardsPerRowArray: number[] = [];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      if (card.offsetTop !== currentRowTop) {
        cardsPerRowArray.push(cardsInCurrentRow);
        cardsInCurrentRow = 1;
        currentRowTop = card.offsetTop;
      } else {
        cardsInCurrentRow++;
      }
    }
    cardsPerRowArray.push(cardsInCurrentRow);

    const cardsPerRow = Math.max(...cardsPerRowArray);

    const containerHeight = container.clientHeight;
    let visibleRows = 0;

    // lista offsetTop-urilor primului card din fiecare rând
    const rowTops: number[] = [];
    currentRowTop = (cards[0] as HTMLElement).offsetTop;
    rowTops.push(currentRowTop);

    for (let i = 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      if (card.offsetTop !== currentRowTop) {
        currentRowTop = card.offsetTop;
        rowTops.push(currentRowTop);
      }
    }

    const sampleCardHeight = (cards[0] as HTMLElement).offsetHeight;
    for (const top of rowTops) {
      if (top + sampleCardHeight <= containerHeight) {
        visibleRows++;
      } else {
        break;
      }
    }

    return { cardsPerRow, visibleRows };
  }
}
