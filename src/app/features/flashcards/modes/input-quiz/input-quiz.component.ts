import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Flashcard } from '../../../../models/flashcard.model';
import { normalizeString } from '../../../../utils/string-normalizer';

@Component({
    selector: 'app-input-quiz',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="card glass-panel quiz-card">
        <span class="level-tag">{{ card.level }}</span>
        
        <div class="content">
            <p class="instruction">Translate this into French:</p>
            <h2 class="term">{{ card.translation }}</h2>
            
            <div class="input-area">
                <input type="text"
                    [(ngModel)]="userInput"
                    (keyup.enter)="checkAnswer()"
                    [disabled]="hasAnswered"
                    placeholder="Type french translation..."
                    class="answer-input"
                    [class.error]="hasAnswered && !isCorrect"
                    [class.success]="hasAnswered && isCorrect"
                    #inputField>
                    
                <button class="btn btn-primary" *ngIf="!hasAnswered" (click)="checkAnswer()">Check</button>
                <button class="btn btn-primary" *ngIf="hasAnswered" (click)="nextCard()">Next</button>
            </div>
            
            <div class="feedback" *ngIf="hasAnswered">
                <div *ngIf="isCorrect">
                    <p class="success-msg">Correct! 🎉</p>
                    <p class="detail">{{ card.term }}</p>
                </div>
                <div *ngIf="!isCorrect">
                    <p class="error-msg">Not quite.</p>
                    <p class="detail">Correct answer: <strong>{{ card.term }}</strong></p>
                    <p class="user-answer">You wrote: {{ userInput }}</p>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .quiz-card {
        text-align: center;
        padding: 3rem 2rem;
        position: relative;
    }
    .level-tag {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255,255,255,0.1);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
    }
    .instruction { color: var(--text-muted); margin-bottom: 0.5rem; }
    .term { font-size: 2.5rem; color: var(--secondary); margin-bottom: 2rem; }
    
    .input-area {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
    }
    .answer-input {
        background: rgba(0,0,0,0.2);
        border: 2px solid rgba(255,255,255,0.1);
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        color: white;
        font-size: 1.2rem;
        width: 100%;
        max-width: 300px;
        outline: none;
        transition: all 0.2s;
    }
    .answer-input:focus { border-color: var(--primary); }
    .answer-input.success { border-color: var(--success); color: var(--success); }
    .answer-input.error { border-color: var(--error); color: var(--error); }
    
    .feedback { animation: fadeIn 0.3s; }
    .success-msg { color: var(--success); font-weight: bold; font-size: 1.2rem; }
    .error-msg { color: var(--error); font-weight: bold; font-size: 1.2rem; }
    .detail { font-size: 1.5rem; margin-top: 0.5rem; }
    .user-answer { color: var(--text-muted); margin-top: 0.5rem; }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class InputQuizComponent implements OnChanges {
    @Input() card!: Flashcard;
    @Output() next = new EventEmitter<{ correct: boolean }>();

    userInput: string = '';
    hasAnswered: boolean = false;
    isCorrect: boolean = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['card']) {
            this.reset();
        }
    }

    reset() {
        this.userInput = '';
        this.hasAnswered = false;
        this.isCorrect = false;
    }

    checkAnswer() {
        if (this.hasAnswered || !this.userInput.trim()) return;

        const normalizedInput = normalizeString(this.userInput);
        const normalizedAnswer = normalizeString(this.card.term);

        this.isCorrect = normalizedInput === normalizedAnswer;
        this.hasAnswered = true;
    }

    nextCard() {
        this.next.emit({ correct: this.isCorrect });
    }
}
