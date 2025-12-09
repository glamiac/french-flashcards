import { Injectable } from '@angular/core';
import { CardStats, UserProgress } from '../models/flashcard.model';

@Injectable({
    providedIn: 'root'
})
export class ProgressService {
    private readonly STORAGE_KEY = 'french_flashcards_progress';
    private progress: UserProgress;

    constructor() {
        this.progress = this.loadProgress();
    }

    private loadProgress(): UserProgress {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse progress', e);
            }
        }
        return { stats: {} };
    }

    private saveProgress(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
    }

    getCardStats(cardId: string): CardStats {
        if (!this.progress.stats[cardId]) {
            this.progress.stats[cardId] = {
                cardId,
                correctCount: 0,
                incorrectCount: 0,
                lastReviewed: 0,
                streak: 0
            };
        }
        return this.progress.stats[cardId];
    }

    recordResult(cardId: string, isCorrect: boolean): void {
        const stats = this.getCardStats(cardId);
        stats.lastReviewed = Date.now();
        if (isCorrect) {
            stats.correctCount++;
            stats.streak++;
        } else {
            stats.incorrectCount++;
            stats.streak = 0;
        }
        this.saveProgress();
    }

    getAllStats(): CardStats[] {
        return Object.values(this.progress.stats);
    }

    resetProgress(): void {
        this.progress = { stats: {} };
        this.saveProgress();
    }
}
