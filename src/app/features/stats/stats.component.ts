import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressService } from '../../services/progress.service';
import { ContentService } from '../../services/content.service';
import { CardStats, Flashcard } from '../../models/flashcard.model';

interface LevelStats {
    level: string;
    total: number;
    mastered: number; // For simplicity, let's say 'mastered' is > 3 correct answers net
    learning: number; // Started but not mastered
    accuracy: number;
}

@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container container-padding">
        <header class="header">
            <button class="btn btn-ghost" (click)="goBack()">← Back</button>
            <h1>Your Progress 📈</h1>
        </header>

        <div class="stats-grid">
            <div class="glass-panel stat-card" *ngFor="let stat of levelStats">
                <div class="stat-header">
                    <h2>{{ stat.level }}</h2>
                    <span class="accuracy">{{ stat.accuracy }}% Accuracy</span>
                </div>
                
                <div class="progress-section">
                    <div class="bar-container">
                        <div class="bar mastered" [style.width.%]="(stat.mastered / stat.total) * 100" title="Mastered"></div>
                        <div class="bar learning" [style.width.%]="(stat.learning / stat.total) * 100" title="Learning"></div>
                    </div>
                    <div class="legend">
                        <span><span class="dot master-dot"></span> Mastered ({{ stat.mastered }})</span>
                        <span><span class="dot learn-dot"></span> Learning ({{ stat.learning }})</span>
                        <span class="total">Total: {{ stat.total }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="glass-panel overall-card">
            <h2>Total Stats</h2>
            <div class="big-numbers">
                <div class="num-item">
                    <span class="val">{{ totalReviewed }}</span>
                    <span class="lbl">Cards Reviewed</span>
                </div>
                <!-- Add more metrics if desired -->
            </div>
            <div class="actions">
                <button class="btn btn-primary" (click)="reset()">Reset All Progress</button>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .container-padding { padding-top: 2rem; padding-bottom: 2rem; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }

    .stats-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        margin-bottom: 2rem;
    }
    
    .stat-card { padding: 1.5rem; }
    
    .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .accuracy {
        font-weight: bold;
        color: var(--success);
    }
    
    .bar-container {
        height: 12px;
        background: rgba(0,0,0,0.3);
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        margin-bottom: 0.5rem;
    }
    
    .bar { height: 100%; transition: width 0.5s ease; }
    .mastered { background: var(--success); }
    .learning { background: var(--warning); }
    
    .legend {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        color: var(--text-muted);
    }
    
    .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;
    }
    .master-dot { background: var(--success); }
    .learn-dot { background: var(--warning); }
    .total { margin-left: auto; }
    
    .overall-card { padding: 2rem; text-align: center; }
    .big-numbers { display: flex; justify-content: center; gap: 3rem; margin: 2rem 0; }
    .num-item { display: flex; flex-direction: column; }
    .val { font-size: 3rem; font-weight: bold; color: var(--primary); }
    .lbl { color: var(--text-muted); }
  `]
})
export class StatsComponent implements OnInit {
    levelStats: LevelStats[] = [];
    totalReviewed: number = 0;

    constructor(
        private progressService: ProgressService,
        private contentService: ContentService,
        private router: Router
    ) { }

    ngOnInit() {
        this.calculateStats();
    }

    calculateStats() {
        this.contentService.getCards().subscribe(allCards => {
            const allStats = this.progressService.getAllStats();
            const statsMap = new Map<string, CardStats>();
            allStats.forEach(s => statsMap.set(s.cardId, s));

            this.totalReviewed = allStats.filter(s => s.lastReviewed > 0).length;

            const levels = ['A1', 'A2', 'B1', 'B2'];
            this.levelStats = levels.map(level => {
                const cardsInLevel = allCards.filter(c => c.level === level);
                let mastered = 0;
                let learning = 0;
                let correctTotal = 0;
                let attemptsTotal = 0;

                cardsInLevel.forEach(card => {
                    const s = statsMap.get(card.id);
                    if (s) {
                        if (s.correctCount > s.incorrectCount + 2) mastered++; // Simple heuristic
                        else learning++;

                        correctTotal += s.correctCount;
                        attemptsTotal += (s.correctCount + s.incorrectCount);
                    }
                });

                return {
                    level,
                    total: cardsInLevel.length,
                    mastered,
                    learning,
                    accuracy: attemptsTotal > 0 ? Math.round((correctTotal / attemptsTotal) * 100) : 0
                };
            });
        });
    }

    reset() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.progressService.resetProgress();
            this.calculateStats();
        }
    }

    goBack() {
        this.router.navigate(['/']);
    }
}
