import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { ProgressService } from '../../../services/progress.service';
import { Flashcard, LanguageLevel } from '../../../models/flashcard.model';
import { FlipCardComponent } from '../modes/flip-card/flip-card.component';
import { InputQuizComponent } from '../modes/input-quiz/input-quiz.component';
import { MultipleChoiceComponent } from '../modes/multiple-choice/multiple-choice.component';

@Component({
  selector: 'app-flashcard-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, FlipCardComponent, InputQuizComponent, MultipleChoiceComponent],
  template: `
    <div class="container viewer-layout">
      <header class="viewer-header">
        <button class="btn btn-ghost" (click)="goBack()">← Exit</button>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progressDerived"></div>
        </div>
        <span class="counter">{{ currentIndex + 1 }} / {{ cards.length }}</span>
      </header>

      <main class="viewer-content" *ngIf="cards.length > 0; else noCards">
        <div class="card-display" [ngSwitch]="mode">
            
          <!-- REVIEW MODE -->
          <app-flip-card *ngSwitchCase="'review'"
            [card]="currentCard"
            (next)="onNext($event)">
          </app-flip-card>

          <!-- INPUT MODE -->
          <app-input-quiz *ngSwitchCase="'input'"
            [card]="currentCard"
            (next)="onNext($event)">
          </app-input-quiz>

          <!-- CHOICE MODE -->
          <app-multiple-choice *ngSwitchCase="'choice'"
            [card]="currentCard"
            [questionIndex]="currentIndex"
            (next)="onNext($event)">
          </app-multiple-choice>

        </div>
      </main>
      
      <ng-template #noCards>
        <div class="empty-state">
           <h2>No cards found for these levels.</h2>
           <button class="btn btn-primary" (click)="goBack()">Go Back</button>
        </div>
      </ng-template>

      <!-- COMPLETION MODAL -->
      <div class="overlay" *ngIf="sessionComplete">
          <div class="glass-panel modal">
              <h2>Session Complete! 🎉</h2>
              <p>You reviewed {{ cards.length }} cards.</p>
              <div class="stats-summary" *ngIf="sessionStats.total > 0">
                 <div class="stat-item success">
                    <span class="value">{{ sessionStats.correct }}</span>
                    <span class="label">Correct</span>
                 </div>
                 <div class="stat-item error">
                    <span class="value">{{ sessionStats.incorrect }}</span>
                    <span class="label">Incorrect</span>
                 </div>
              </div>
              <div class="actions">
                  <button class="btn btn-primary" (click)="restart()">Next Session</button>
                  <button class="btn btn-secondary" (click)="goToStats()">Review Stats</button>
                  <button class="btn btn-ghost" (click)="goBack()">Home</button>
              </div>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer-layout {
        display: flex; 
        flex-direction: column;
        height: 100vh;
        max-height: 100vh;
        padding-top: 1rem;
        padding-bottom: 2rem;
    }
    .viewer-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .progress-bar {
      flex: 1;
      height: 8px;
      background: var(--surface);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--success);
      transition: width 0.3s ease;
    }
    .counter {
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }
    
    .viewer-content {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .card-display {
      width: 100%;
      max-width: 600px;
    }

    .overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        animation: fadeIn 0.3s;
    }
    .modal {
        padding: 3rem;
        text-align: center;
        min-width: 300px;
    }
    .stats-summary {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin: 2rem 0;
    }
    .stat-item {
        display: flex;
        flex-direction: column;
    }
    .stat-item .value { font-size: 2rem; font-weight: bold; }
    .stat-item.success .value { color: var(--success); }
    .stat-item.error .value { color: var(--error); }
    .actions {
        display: flex; 
        gap: 1rem; 
        justify-content: center;
    }
  `]
})
export class FlashcardViewerComponent implements OnInit {
  mode: string = 'review';
  levels: LanguageLevel[] = [];
  cards: Flashcard[] = [];
  currentCategories: string[] = [];
  currentIndex: number = 0;
  sessionComplete: boolean = false;

  sessionStats = { correct: 0, incorrect: 0, total: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private progressService: ProgressService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode') || 'review';
    });
    this.route.queryParamMap.subscribe(params => {
      const levelsStr = params.get('levels');
      const categoriesStr = params.get('categories');

      if (levelsStr) {
        this.levels = levelsStr.split(',') as LanguageLevel[];
        const categories = categoriesStr ? categoriesStr.split(',') : [];
        this.currentCategories = categories;
        this.loadCards(categories);
      } else {
        this.goBack();
      }
    });
  }

  loadCards(categories: string[] = []) {
    this.contentService.getSmartSession(this.levels, categories, 10).subscribe(cards => {
      // Shuffle is already done in smart session but doing it again doesn't hurt, 
      // though smart session returns prioritized list so we should arguably NOT shuffle 
      // across groups if we want to prioritize learning. 
      // However, mixing them a bit might be nice? 
      // Actually, the user wants to review. Let's keep the priority order. 
      // But users usually expect random order in a session.
      // Let's shuffle the FINAL set of 10 so you don't always get the "hardest" first.
      this.cards = this.shuffle(cards);
      this.currentIndex = 0;
      this.sessionComplete = false;
      this.sessionStats = { correct: 0, incorrect: 0, total: 0 };
    });
  }

  get currentCard(): Flashcard {
    return this.cards[this.currentIndex];
  }

  get progressDerived(): number {
    if (this.cards.length === 0) return 0;
    return ((this.currentIndex) / this.cards.length) * 100;
  }

  onNext(result: { correct: boolean } | null) {
    if (result) {
      this.sessionStats.total++;
      if (result.correct) this.sessionStats.correct++;
      else this.sessionStats.incorrect++;

      // Record persistence
      this.progressService.recordResult(this.currentCard.id, result.correct);
    }

    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
    } else {
      this.sessionComplete = true;
    }
  }

  restart() {
    this.loadCards(this.currentCategories);
  }

  goToStats() {
    this.router.navigate(['/stats']);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  private shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
