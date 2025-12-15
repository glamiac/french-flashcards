import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContentService } from './content.service';
import { ProgressService } from './progress.service';
import { Flashcard, CardStats } from '../models/flashcard.model';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ContentService', () => {
    let service: ContentService;
    let httpMock: HttpTestingController;
    let progressService: ProgressService;

    const mockCards: Flashcard[] = [
        { id: '1', term: 'bonjour', translation: 'hello', level: 'A1', category: 'Greetings' },
        { id: '2', term: 'au revoir', translation: 'goodbye', level: 'A1', category: 'Greetings' },
        { id: '3', term: 'chat', translation: 'cat', level: 'A2', category: 'Animals' }
    ];

    beforeEach(() => {
        // Mock ProgressService
        const progressServiceMock = {
            getCardStats: vi.fn()
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ContentService,
                { provide: ProgressService, useValue: progressServiceMock }
            ]
        });
        service = TestBed.inject(ContentService);
        httpMock = TestBed.inject(HttpTestingController);
        progressService = TestBed.inject(ProgressService);

        // Mock the initial load request
        const req = httpMock.expectOne(req => req.url.includes('flashcards.json'));
        req.flush(mockCards);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should calculate user stats correctly', () => {
        // Mock stats responses
        const statsMap: Record<string, CardStats> = {
            '1': { cardId: '1', correctCount: 5, incorrectCount: 0, lastReviewed: 0, streak: 5 },
            '2': { cardId: '2', correctCount: 1, incorrectCount: 1, lastReviewed: 0, streak: 0 },
            '3': { cardId: '3', correctCount: 0, incorrectCount: 0, lastReviewed: 0, streak: 0 }
        };

        vi.spyOn(progressService, 'getCardStats').mockImplementation((id: string) => {
            return statsMap[id] || { cardId: id, correctCount: 0, incorrectCount: 0, lastReviewed: 0, streak: 0 };
        });

        return new Promise<void>((resolve) => {
            service.getUserStats().subscribe(stats => {
                expect(stats.totalCorrect).toBe(6); // 5 + 1
                expect(stats.totalIncorrect).toBe(1); // 0 + 1 + 0
                expect(stats.wordsLearned).toBe(1); // Card 1 only (streak >= 3)

                // Level A1: 2 cards. Card 1 (5/5), Card 2 (1/2). Total correct: 6. Total attempts: 7.
                // Accuracy: 6/7 = ~85.7% -> 86%
                expect(stats.levelAccuracy['A1']).toBe(86);
                expect(stats.levelCorrectCount['A1']).toBe(6);
                expect(stats.levelTotalAttempts['A1']).toBe(7);

                // Level A2: 1 card. 0 attempts.
                // Expect 0 or undefined depending on implementation for 0 attempts. 
                // My implementation: if (levelAttempts[level] > 0) sets accuracy. Else it stays 0 (initialized).
                expect(stats.levelAccuracy['A2']).toBe(0);
                expect(stats.levelCorrectCount['A2']).toBe(0);
                expect(stats.levelTotalAttempts['A2']).toBe(0);

                expect(stats.totalCardsPerLevel['A1']).toBe(2);
                expect(stats.totalCardsPerLevel['A2']).toBe(1);

                resolve();
            });
        });
    });
});
