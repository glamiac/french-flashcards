
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flashcard, LanguageLevel } from '../models/flashcard.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    // Initial dataset will be loaded from JSON
    private flashcards: Flashcard[] = [];

    private cardsSubject = new BehaviorSubject<Flashcard[]>(this.flashcards);

    constructor(private http: HttpClient) { }

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

    getAllCategories(): string[] {
        const categories = new Set(this.flashcards.map(c => c.category));
        return Array.from(categories);
    }

    // Load flashcards from external JSON file
    loadCards(): void {
        this.http.get<Flashcard[]>('flashcards.json').subscribe(cards => {
            this.flashcards = cards;
            this.cardsSubject.next(cards);
        });
    }
}

