export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface Flashcard {
    id: string;
    term: string; // The French word/phrase
    translation: string; // The English translation
    level: LanguageLevel;
    category: string; // e.g., 'Greetings', 'Food', 'Verbs'
    exampleSentence?: string;
    exampleTranslation?: string;
}

export interface CardStats {
    cardId: string;
    correctCount: number;
    incorrectCount: number;
    lastReviewed: number; // timestamp
    streak: number; // Consecutive correct answers
}

export interface UserProgress {
    stats: Record<string, CardStats>; // Map cardId to stats
}

export interface UserStats {
    totalCorrect: number;
    totalIncorrect: number;
    wordsLearned: number; // streak >= 3
    levelAccuracy: Record<LanguageLevel, number>; // percentage 0-100
    totalCardsPerLevel: Record<LanguageLevel, number>;
    levelCorrectCount: Record<LanguageLevel, number>;
    levelTotalAttempts: Record<LanguageLevel, number>;
}
