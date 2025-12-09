import { Injectable } from '@angular/core';
import { Flashcard, LanguageLevel } from '../models/flashcard.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    // Initial dataset
    private flashcards: Flashcard[] = [
        // A1 - Basics & Greetings
        { id: 'a1-1', term: 'bonjour', translation: 'hello', level: 'A1', category: 'Greetings', exampleSentence: 'Bonjour, comment ça va?' },
        { id: 'a1-2', term: 'au revoir', translation: 'goodbye', level: 'A1', category: 'Greetings', exampleSentence: 'Au revoir et à bientôt!' },
        { id: 'a1-3', term: 's\'il vous plaît', translation: 'please', level: 'A1', category: 'Greetings', exampleSentence: 'Un café, s\'il vous plaît.' },
        { id: 'a1-4', term: 'merci', translation: 'thank you', level: 'A1', category: 'Greetings', exampleSentence: 'Merci beaucoup.' },
        { id: 'a1-5', term: 'chat', translation: 'cat', level: 'A1', category: 'Animals', exampleSentence: 'Le chat dort sur le canapé.' },
        { id: 'a1-6', term: 'chien', translation: 'dog', level: 'A1', category: 'Animals', exampleSentence: 'Mon chien est gentil.' },
        { id: 'a1-7', term: 'pomme', translation: 'apple', level: 'A1', category: 'Food', exampleSentence: 'J\'aime manger une pomme.' },
        { id: 'a1-8', term: 'pain', translation: 'bread', level: 'A1', category: 'Food', exampleSentence: 'Du pain et du beurre.' },
        { id: 'a1-9', term: 'livre', translation: 'book', level: 'A1', category: 'Objects', exampleSentence: 'Ce livre est intéressant.' },
        { id: 'a1-10', term: 'maison', translation: 'house', level: 'A1', category: 'Places', exampleSentence: 'Grande maison blanche.' },

        // A2 - Routine & Description
        { id: 'a2-1', term: 'voiture', translation: 'car', level: 'A2', category: 'Transport', exampleSentence: 'Ma voiture est en panne.' },
        { id: 'a2-2', term: 'école', translation: 'school', level: 'A2', category: 'Places', exampleSentence: 'Je vais à l\'école tous les jours.' },
        { id: 'a2-3', term: 'travail', translation: 'work', level: 'A2', category: 'Business', exampleSentence: 'Il cherche du travail.' },
        { id: 'a2-4', term: 'vacances', translation: 'vacation', level: 'A2', category: 'Leisure', exampleSentence: 'Vive les vacances!' },
        { id: 'a2-5', term: 'fatigué', translation: 'tired', level: 'A2', category: 'Adjectives', exampleSentence: 'Je suis très fatigué ce soir.' },
        { id: 'a2-6', term: 'heureux', translation: 'happy', level: 'A2', category: 'Adjectives', exampleSentence: 'Ils sont heureux ensemble.' },

        // B1 - Opinions & Work
        { id: 'b1-1', term: 'développement', translation: 'development', level: 'B1', category: 'Work', exampleSentence: 'Le développement web est passionnant.' },
        { id: 'b1-2', term: 'cependant', translation: 'however', level: 'B1', category: 'Connectors', exampleSentence: 'Il pleut, cependant je sors.' },
        { id: 'b1-3', term: 'puisque', translation: 'since / as', level: 'B1', category: 'Connectors', exampleSentence: 'Puisque tu es là, restons.' },
        { id: 'b1-4', term: 'environ', translation: 'approximately', level: 'B1', category: 'Adverbs', exampleSentence: 'Il y a environ dix personnes.' },
        { id: 'b1-5', term: 'entreprise', translation: 'company', level: 'B1', category: 'Business', exampleSentence: 'Cette entreprise recrute.' },

        // B2 - Abstract & Nuance
        { id: 'b2-1', term: 'incontournable', translation: 'unavoidable / must-see', level: 'B2', category: 'Adjectives', exampleSentence: 'C\'est un lieu incontournable.' },
        { id: 'b2-2', term: 'auprès de', translation: 'near to / with', level: 'B2', category: 'Prepositions', exampleSentence: 'Reste auprès de moi.' },
        { id: 'b2-3', term: 'désormais', translation: 'from now on', level: 'B2', category: 'Adverbs', exampleSentence: 'Désormais, tout va changer.' },
        { id: 'b2-4', term: 'envergure', translation: 'scope / scale', level: 'B2', category: 'Nouns', exampleSentence: 'Un projet de grande envergure.' },
        { id: 'b2-5', term: 'revendiquer', translation: 'to claim', level: 'B2', category: 'Verbs', exampleSentence: 'Il revendique ses droits.' }
    ];

    private cardsSubject = new BehaviorSubject<Flashcard[]>(this.flashcards);

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
}
