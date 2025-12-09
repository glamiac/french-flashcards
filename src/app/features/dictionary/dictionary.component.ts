import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Flashcard, LanguageLevel } from '../../models/flashcard.model';

@Component({
    selector: 'app-dictionary',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container container-padding">
      <header class="header">
        <button class="btn btn-ghost" (click)="goBack()">← Back</button>
        <h1>Dictionary 📖</h1>
      </header>
      
      <div class="glass-panel controls">
         <input type="text" [(ngModel)]="searchTerm" placeholder="Search words..." class="search-input">
         
         <div class="filters">
            <select [(ngModel)]="categoryFilter">
                <option value="">All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
            </select>
            
            <select [(ngModel)]="levelFilter">
                <option value="">All Levels</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
            </select>
         </div>
      </div>
      
      <div class="word-list">
         <div class="glass-panel word-card" *ngFor="let card of filteredCards">
             <div class="word-main">
                 <span class="term">{{ card.term }}</span>
                 <span class="translation">{{ card.translation }}</span>
             </div>
             <div class="word-meta">
                 <span class="badge level">{{ card.level }}</span>
                 <span class="badge category">{{ card.category }}</span>
             </div>
             <p class="example" *ngIf="card.exampleSentence">"{{ card.exampleSentence }}"</p>
         </div>
         <div class="empty" *ngIf="filteredCards.length === 0">
             No words found.
         </div>
      </div>
    </div>
  `,
    styles: [`
    .container-padding { padding-top: 2rem; padding-bottom: 2rem; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    
    .controls {
        padding: 1rem;
        margin-bottom: 2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
    }
    
    .search-input {
        flex: 1;
        min-width: 200px;
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        padding: 0.75rem;
        border-radius: var(--radius-sm);
        color: white;
    }
    
    .filters select {
        background: var(--surface);
        color: white;
        border: 1px solid rgba(255,255,255,0.1);
        padding: 0.75rem;
        border-radius: var(--radius-sm);
    }
    
    .word-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }
    
    .word-card {
        padding: 1.5rem;
        transition: transform 0.2s;
    }
    .word-card:hover { transform: translateY(-2px); background: rgba(30, 41, 59, 0.9); }
    
    .word-main { margin-bottom: 0.5rem; }
    .term { font-size: 1.5rem; font-weight: bold; display: block; color: var(--primary); }
    .translation { font-size: 1.25rem; color: var(--text-main); }
    
    .word-meta { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .badge { 
        font-size: 0.75rem; 
        padding: 0.2rem 0.5rem; 
        border-radius: 4px; 
        background: rgba(255,255,255,0.1); 
    }
    .level { color: var(--accent); border: 1px solid var(--accent); }
    .category { color: var(--text-muted); }
    
    .example { font-style: italic; color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem; }
  `]
})
export class DictionaryComponent implements OnInit {
    cards: Flashcard[] = [];
    categories: string[] = [];

    searchTerm: string = '';
    categoryFilter: string = '';
    levelFilter: string = '';

    constructor(private contentService: ContentService, private router: Router) { }

    ngOnInit() {
        this.contentService.getCards().subscribe(cards => {
            this.cards = cards;
        });
        this.categories = this.contentService.getAllCategories().sort();
    }

    get filteredCards() {
        return this.cards.filter(c => {
            const matchesSearch = !this.searchTerm ||
                c.term.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                c.translation.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCategory = !this.categoryFilter || c.category === this.categoryFilter;
            const matchesLevel = !this.levelFilter || c.level === this.levelFilter;

            return matchesSearch && matchesCategory && matchesLevel;
        });
    }

    goBack() {
        this.router.navigate(['/']);
    }
}
