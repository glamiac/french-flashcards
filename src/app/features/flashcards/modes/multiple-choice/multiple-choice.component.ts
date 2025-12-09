import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../../services/content.service';
import { Flashcard } from '../../../../models/flashcard.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-multiple-choice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card glass-panel quiz-card">
      <span class="level-tag">{{ card.level }}</span>
      <div class="content">
        <p class="instruction">Choose the correct translation for:</p>
        <h2 class="term">{{ card.term }}</h2>
        
        <div class="options-grid">
          <button *ngFor="let option of options" 
            class="option-btn"
            [class.correct]="hasAnswered && option === card.translation"
            [class.wrong]="hasAnswered && selectedOption === option && option !== card.translation"
            [disabled]="hasAnswered"
            (click)="selectOption(option)">
            {{ option }}
          </button>
        </div>
        
        <div class="feedback-actions" *ngIf="hasAnswered">
           <button class="btn btn-primary" (click)="nextCard()">Next Card →</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-card { padding: 3rem 2rem; position: relative; text-align: center; }
    .level-tag { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem; }
    .instruction { color: var(--text-muted); }
    .term { font-size: 3rem; color: var(--primary); margin: 1rem 0 2rem; }
    
    .options-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .option-btn {
      padding: 1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      font-size: 1.1rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-btn:hover:not(:disabled) {
      background: rgba(255,255,255,0.1);
      transform: translateY(-2px);
    }
    .option-btn.correct { background: var(--success); border-color: var(--success); }
    .option-btn.wrong { background: var(--error); border-color: var(--error); }
    
    .feedback-actions { margin-top: 2rem; animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class MultipleChoiceComponent implements OnChanges {
  @Input() card!: Flashcard;
  @Output() next = new EventEmitter<{ correct: boolean }>();

  options: string[] = [];
  hasAnswered = false;
  selectedOption: string | null = null;

  constructor(private contentService: ContentService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card'] && this.card) {
      this.generateOptions();
    }
  }

  generateOptions() {
    this.hasAnswered = false;
    this.selectedOption = null;

    // Use the correct service method to fetch cards of the same level
    this.contentService.getCardsByLevel(this.card.level).pipe(take(1)).subscribe((allCards: Flashcard[]) => {
      // Filter out the current card to avoid duplicate answer
      const distractors = allCards
        .filter((c: Flashcard) => c.id !== this.card.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map((c: Flashcard) => c.translation);

      // Ensure we have at least two distractors
      while (distractors.length < 2) {
        distractors.push('Unknown'); // fallback value
      }

      this.options = [this.card.translation, ...distractors].sort(() => Math.random() - 0.5);
    });
  }

  selectOption(option: string) {
    this.hasAnswered = true;
    this.selectedOption = option;
    // Don't emit next immediately, wait for user to click Next
  }

  nextCard() {
    const isCorrect = this.selectedOption === this.card.translation;
    this.next.emit({ correct: isCorrect });
  }
}
