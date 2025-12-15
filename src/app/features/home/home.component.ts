import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { LanguageLevel } from '../../models/flashcard.model';

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
          <h2>2. Choose Mode</h2>
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
          </div>
        </div>

        <!-- Links -->
        <div class="glass-panel selection-card">
          <h2>3. Extras</h2>
          <div class="mode-options">
             <button class="mode-btn" routerLink="/stats">
               <span class="icon">📊</span>
               <span class="label">View Statistics</span>
               <span class="desc">Track your progress.</span>
             </button>
             <button class="mode-btn" routerLink="/dictionary">
               <span class="icon">📖</span>
               <span class="label">Dictionary</span>
               <span class="desc">Browse all words.</span>
             </button>
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
  `]
})
export class HomeComponent {
  levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2'];
  selectedLevels: LanguageLevel[] = ['A1']; // Default A1

  categories: { name: string; count: number }[] = [];
  selectedCategories: string[] = [];
  selectedLevel: LanguageLevel = 'A1';

  constructor(private router: Router, private contentService: ContentService, private cdr: ChangeDetectorRef) {
    // We'll rely on subscription now
  }

  ngOnInit() {
    this.contentService.getCards().subscribe(cards => {
      if (cards.length > 0) {
        this.updateAvailableCategories();
      }
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
