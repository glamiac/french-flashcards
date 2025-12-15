
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flashcard, LanguageLevel, UserStats } from '../models/flashcard.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProgressService } from './progress.service';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    // Initial dataset will be loaded from JSON
    private flashcards: Flashcard[] = [];

    private cardsSubject = new BehaviorSubject<Flashcard[]>(this.flashcards);

    constructor(private http: HttpClient, private progressService: ProgressService) {
        this.loadCards();
    }

    getCards(): Observable<Flashcard[]> {
        return this.cardsSubject.asObservable();
    }

    getCardsByLevel(level: LanguageLevel): Observable<Flashcard[]> {
        return this.getCards().pipe(
            map(cards => cards.filter(c => c.level === level))
        );
    }

    getCardsByFilters(levels: LanguageLevel[], categories: string[]): Observable<Flashcard[]> {
        return this.getCards().pipe(
            map(cards => cards.filter(c => {
                const levelMatch = levels.length === 0 || levels.includes(c.level);
                const categoryMatch = categories.length === 0 || categories.includes(c.category);
                return levelMatch && categoryMatch;
            }))
        );
    }

    // Load flashcards from external JSON file
    loadCards(): void {
        const timestamp = new Date().getTime();
        console.log('ContentService: Loading cards from flashcards.json');
        this.http.get<Flashcard[]>(`flashcards.json?v=${timestamp}`).subscribe({
            next: (cards) => {
                console.log(`ContentService: Loaded ${cards.length} cards`);
                this.flashcards = cards;
                this.cardsSubject.next(cards);
            },
            error: (err) => {
                console.error('ContentService: Error loading cards', err);
            }
        });
    }

    // prioritizing learning (>0 but <3 correct) > new (0 attempts) > mastered (>=3 correct)
    getSmartSession(levels: LanguageLevel[], categories: string[], limit: number = 10): Observable<Flashcard[]> {
        console.log(`getSmartSession called with levels: ${levels}, categories: ${categories}, limit: ${limit}`);
        return this.getCardsByFilters(levels, categories).pipe(
            map(cards => {
                console.log(`getSmartSession: filtered cards count: ${cards.length}`);
                const now = Date.now();

                const learning: Flashcard[] = [];
                const newCards: Flashcard[] = [];
                const mastered: Flashcard[] = [];

                cards.forEach(card => {
                    const stats = this.progressService.getCardStats(card.id);
                    if (stats.correctCount >= 3) mastered.push(card);
                    else if (stats.correctCount > 0 || stats.incorrectCount > 0) learning.push(card);
                    else newCards.push(card);
                });

                console.log(`Smart Session Stats - Learning: ${learning.length}, New: ${newCards.length}, Mastered: ${mastered.length}`);

                // Shuffle
                const shuffle = (arr: Flashcard[]) => arr.sort(() => Math.random() - 0.5);

                // Concat: Learning -> New -> Mastered
                let session = [...shuffle(learning), ...shuffle(newCards), ...shuffle(mastered)];

                console.log(`getSmartSession: returning ${session.slice(0, limit).length} cards`);

                return session.slice(0, limit);
            })
        );
    }

    getAllCategories(userLevels: LanguageLevel[] = []): { name: string; count: number }[] {
        const counts: { [key: string]: number } = {};

        let targetCards = this.flashcards;
        if (userLevels.length > 0) {
            targetCards = this.flashcards.filter(c => userLevels.includes(c.level));
        }

        targetCards.forEach(c => {
            const cat = c.category || 'General Vocabulary';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        return Object.keys(counts)
            .sort()
            .map(name => ({ name, count: counts[name] }));
    }

    getUserStats(): Observable<UserStats> {
        return this.getCards().pipe(
            map(cards => {
                const stats: UserStats = {
                    totalCorrect: 0,
                    totalIncorrect: 0,
                    wordsLearned: 0,
                    levelAccuracy: { 'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0 },
                    totalCardsPerLevel: { 'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0 },
                    levelCorrectCount: { 'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0 },
                    levelTotalAttempts: { 'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0 }
                };

                const levels = ['A1', 'A2', 'B1', 'B2'] as LanguageLevel[];

                cards.forEach(card => {
                    const cardStats = this.progressService.getCardStats(card.id);
                    stats.totalCorrect += cardStats.correctCount;
                    stats.totalIncorrect += cardStats.incorrectCount;

                    if (cardStats.streak >= 3) {
                        stats.wordsLearned++;
                    }

                    stats.totalCardsPerLevel[card.level] = (stats.totalCardsPerLevel[card.level] || 0) + 1;

                    if (cardStats.correctCount > 0 || cardStats.incorrectCount > 0) {
                        stats.levelCorrectCount[card.level] += cardStats.correctCount;
                        stats.levelTotalAttempts[card.level] += (cardStats.correctCount + cardStats.incorrectCount);
                    }
                });

                levels.forEach(level => {
                    if (stats.levelTotalAttempts[level] > 0) {
                        stats.levelAccuracy[level] = Math.round((stats.levelCorrectCount[level] / stats.levelTotalAttempts[level]) * 100);
                    }
                });

                return stats;
            })
        );
    }
}

