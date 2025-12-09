import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flashcard } from '../../../../models/flashcard.model';

@Component({
  selector: 'app-flip-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene">
      <div class="card-object" [class.is-flipped]="isFlipped" (click)="flip()">
        <div class="card-face card-front">
          <span class="level-tag">{{ card.level }}</span>
          <div class="content">
            <h2 class="term">{{ card.term }}</h2>
            <p class="hint">Tap to flip</p>
          </div>
        </div>
        <div class="card-face card-back">
          <div class="content">
            <h2 class="translation">{{ card.translation }}</h2>
            <p class="example" *ngIf="card.exampleSentence">"{{ card.exampleSentence }}"</p>
            <p class="category">{{ card.category }}</p>
          </div>
          
          <div class="actions" (click)="$event.stopPropagation()">
            <!-- In straight Review mode, we might just want 'Next', but user asked to track stats. 
                 Let's offer 'Got it' vs 'Missed it' for self-grading, or just a 'Next' if they don't want to rate.
                 Review mode usually implies self-grading. -->
            <button class="btn btn-action miss" (click)="rate(false)">Difficult 👎</button>
            <button class="btn btn-action hit" (click)="rate(true)">Good 👍</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scene {
      width: 100%;
      height: 400px;
      perspective: 1000px;
    }
    .card-object {
      width: 100%;
      height: 100%;
      position: relative;
      transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
      transform-style: preserve-3d;
      cursor: pointer;
    }
    .is-flipped {
      transform: rotateY(180deg);
    }
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: var(--radius-lg);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: var(--shadow-lg);
    }
    .card-front {
      background: linear-gradient(135deg, var(--surface), var(--surface-light));
    }
    .card-back {
      background: linear-gradient(135deg, var(--surface-light), var(--surface));
      transform: rotateY(180deg);
      justify-content: space-between; /* Space for actions at bottom */
    }

    .level-tag {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255,255,255,0.1);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: bold;
    }

    .term { font-size: 3rem; margin-bottom: 0.5rem; color: var(--primary); }
    .translation { font-size: 2.5rem; margin-bottom: 1rem; color: var(--secondary); }
    .hint { color: var(--text-muted); font-size: 0.9rem; }
    .example { font-style: italic; color: var(--text-main); margin-bottom: 0.5rem; }
    .category { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: auto;
      width: 100%;
    }
    .btn-action {
      flex: 1;
      padding: 1rem;
      border: none;
      border-radius: var(--radius-sm);
      color: white;
      font-weight: bold;
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.1s;
    }
    .btn-action:active { transform: scale(0.95); }
    .miss { background: var(--error); }
    .hit { background: var(--success); }
  `]
})
export class FlipCardComponent implements OnChanges {
  @Input() card!: Flashcard;
  @Output() next = new EventEmitter<{ correct: boolean }>();

  isFlipped = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card']) {
      this.isFlipped = false;
    }
  }

  flip() {
    this.isFlipped = !this.isFlipped;
  }

  rate(correct: boolean) {
    // Unflip first to hide the back face
    this.isFlipped = false;

    // Wait for the half-flip (or reasonable duration) ensuring the user sees the front of the OLD card 
    // spinning back before the data is swapped. 
    // Transition is 0.6s. 300ms is 90deg (invisible). 
    // But safer to wait most of it so it looks like it lands back on front, then swaps.
    setTimeout(() => {
      this.next.emit({ correct });
    }, 600);
  }
}
