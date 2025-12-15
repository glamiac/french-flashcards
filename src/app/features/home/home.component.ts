import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { LanguageLevel, UserStats } from '../../models/flashcard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container fade-in">
      <header class="hero">
        <h1>Maîtrisez le Français</h1>
        <p class="subtitle">Select your level and study mode to begin.</p>
      </header>
      
      <div class="selection-grid">
        <!-- Level Selection -->
        <div class="glass-panel selection-card">
          <h2>1. Choose Level</h2>
          <div class="level-options">
            <label *ngFor="let level of levels" class="level-radio">
              <input type="checkbox" [value]="level" (change)="toggleLevel(level)" [checked]="selectedLevels.includes(level)">
              <span class="level-badge" [class.active]="selectedLevels.includes(level)">{{ level }}</span>
            </label>
          </div>
          <p class="hint" *ngIf="selectedLevels.length === 0">Please select at least one level.</p>
        </div>

        <!-- Category Selection -->
        <div class="glass-panel selection-card">
          <h2>2. Choose Categories <small>(Optional)</small></h2>
          <div class="level-options category-options">
             <label *ngFor="let cat of categories" class="level-radio">
                <input type="checkbox" [value]="cat.name" (change)="toggleCategory(cat.name)" [checked]="selectedCategories.includes(cat.name)">
                <span class="level-badge" [class.active]="selectedCategories.includes(cat.name)">{{ cat.name }} <span class="badge">({{cat.count}})</span></span>
             </label>
          </div>
          <p class="hint small-hint">Leave empty to include all categories.</p>
        </div>

        <!-- Mode Selection -->
        <div class="glass-panel selection-card">
          <h2>3. Choose Mode</h2>
          <div class="mode-options">
            <button class="mode-btn" (click)="startSession('review')">
              <span class="icon">🃏</span>
              <span class="label">Flashcards</span>
              <span class="desc">Flip cards to learn.</span>
            </button>
            <button class="mode-btn" (click)="startSession('input')">
              <span class="icon">⌨️</span>
              <span class="label">Type Answer</span>
              <span class="desc">Practice spelling.</span>
            </button>
            <button class="mode-btn" (click)="startSession('choice')">
              <span class="icon">🤔</span>
              <span class="label">Multiple Choice</span>
              <span class="desc">Identify the correct term.</span>
            </button>
             <button class="mode-btn" routerLink="/dictionary">
               <span class="icon">📖</span>
               <span class="label">Dictionary</span>
               <span class="desc">Browse all words.</span>
             </button>
          </div>
        </div>

        <!-- Stats Card -->
        <div class="glass-panel selection-card stats-card" *ngIf="userStats">
            <h2>Your Progress</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value">{{ userStats.wordsLearned }}</span>
                    <span class="stat-label">Words Learned</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">{{ userStats.totalCorrect }}</span>
                    <span class="stat-label">Total Correct</span>
                </div>
                 <div class="stat-item">
                    <span class="stat-value">{{ userStats.totalIncorrect }}</span>
                    <span class="stat-label">Total Incorrect</span>
                </div>
            </div>
            <div class="level-accuracy">
                <h3>Accuracy by Level</h3>
                <div class="accuracy-bars">
                    <div class="accuracy-item" *ngFor="let level of levels">
                        <div class="level-label">{{ level }}</div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" [style.width.%]="userStats.levelAccuracy[level]" [class.high]="userStats.levelAccuracy[level] >= 80" [class.medium]="userStats.levelAccuracy[level] >= 50 && userStats.levelAccuracy[level] < 80" [class.low]="userStats.levelAccuracy[level] < 50"></div>
                        </div>
                        <div class="accuracy-text">
                            <span *ngIf="userStats.levelTotalAttempts[level] > 0; else noData">
                                {{ userStats.levelCorrectCount[level] }}/{{ userStats.levelTotalAttempts[level] }}
                            </span>
                            <ng-template #noData>-</ng-template>
                        </div>
                    </div>
                </div>
                <div class="stats-footer">
                   <button class="mode-btn full-width" routerLink="/stats">
                     <span class="icon">📊</span>
                     <span class="label">View Statistics</span>
                     <span class="desc">See detailed breakdown</span>
                   </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .hero {
      text-align: center;
      padding: 4rem 1rem;
    }
    .subtitle {
      font-size: 1.25rem;
      color: var(--text-muted);
    }
    
    .selection-grid {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
    
    .selection-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .stats-card {
        border: 1px solid var(--accent);
        background: rgba(var(--accent-rgb), 0.05);
    }

    h2 {
      font-size: 1.5rem;
      color: var(--secondary);
      margin-bottom: 0.5rem;
    }

    .level-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .level-radio input { display: none; }
    .level-badge {
      display: block;
      text-align: center;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.05);
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .level-badge:hover { background: rgba(255,255,255,0.1); }
    .level-badge.active {
      background: var(--primary);
      color: white;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
    }

    .mode-options {
      display: grid;
      gap: 1rem;
    }
    .mode-btn {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      gap: 0 1rem;
      align-items: center;
      padding: 1rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }
    .mode-btn:hover {
      background: rgba(255,255,255,0.08);
      transform: translateX(5px);
      border-color: var(--accent);
    }
    .mode-btn .icon {
      grid-row: 1 / -1;
      font-size: 2rem;
    }
    .mode-btn .label {
      font-weight: 700;
      font-size: 1.1rem;
    }
    .mode-btn .desc {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .extra-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .hint { color: var(--error); font-size: 0.9rem; }
    .small-hint { color: var(--text-muted); font-size: 0.8rem; margin-top: 0.5rem; }
    
    .category-options {
        display: flex; /* keep categories as flexible tags or grid? User asked "fill the card" for levels. Categories "add all". Let's stick to flex wrap for categories but allow it to grow */
        flex-wrap: wrap;
        max-height: 400px; /* Increased from 200px */
        overflow-y: auto;
        padding-right: 0.5rem;
    }
    
    /* Specific override for categories to behave like tags still, but ensure all are shown */
    .category-options .level-badge {
         display: inline-block;
         width: auto;
    }
    
    .glass-panel h2 small {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: normal;
    }

    /* Stats Specific Styles */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        text-align: center;
        margin-bottom: 1rem;
    }
    .stat-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .stat-value {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--accent);
    }
    .stat-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .level-accuracy h3 {
        font-size: 1rem;
        color: var(--text-main);
        margin-bottom: 0.75rem;
    }
    .accuracy-bars {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .accuracy-item {
        display: grid;
        grid-template-columns: 30px 1fr 40px;
        gap: 1rem;
        align-items: center;
        font-size: 0.9rem;
    }
    .stats-footer {
        margin-top: 1.5rem;
    }
    .progress-bar-bg {
        height: 6px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        overflow: hidden;
    }
    .progress-bar-fill {
        height: 100%;
        background: var(--primary);
        border-radius: 3px;
        transition: width 0.5s ease-out;
    }
    .progress-bar-fill.high { background: #10b981; }
    .progress-bar-fill.medium { background: #f59e0b; }
    .progress-bar-fill.low { background: #ef4444; }
    .accuracy-text {
        text-align: right;
        color: var(--text-muted);
    }
    .full-width {
        width: 100%;
    }
  `]
})
export class HomeComponent {
  levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2'];
  selectedLevels: LanguageLevel[] = ['A1']; // Default A1

  categories: { name: string; count: number }[] = [];
  selectedCategories: string[] = [];
  selectedLevel: LanguageLevel = 'A1';

  userStats: UserStats | null = null;

  constructor(private router: Router, private contentService: ContentService, private cdr: ChangeDetectorRef) {
    // We'll rely on subscription now
  }

  ngOnInit() {
    this.contentService.getCards().subscribe(cards => {
      if (cards.length > 0) {
        this.updateAvailableCategories();
      }
    });

    this.contentService.getUserStats().subscribe(stats => {
      this.userStats = stats;
      this.cdr.detectChanges();
    });
  }

  toggleLevel(level: LanguageLevel) {
    if (this.selectedLevels.includes(level)) {
      this.selectedLevels = this.selectedLevels.filter(l => l !== level);
    } else {
      this.selectedLevels.push(level);
    }
    this.updateAvailableCategories();
  }

  updateAvailableCategories() {
    console.log('HomeComponent: Updating categories. Selected levels:', this.selectedLevels);
    this.categories = this.contentService.getAllCategories(this.selectedLevels);
    console.log('HomeComponent: Categories updated. Count:', this.categories.length);
    this.cdr.detectChanges();
  }

  toggleCategory(categoryName: string) {
    if (this.selectedCategories.includes(categoryName)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== categoryName);
    } else {
      this.selectedCategories.push(categoryName);
    }
  }

  startSession(mode: 'review' | 'choice' | 'input') {
    if (this.selectedLevels.length === 0 && this.selectedCategories.length === 0) {
      // Validation could go here
    }

    this.router.navigate(['/flashcards', mode], {
      queryParams: {
        levels: this.selectedLevels.join(','),
        categories: this.selectedCategories.join(',')
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
