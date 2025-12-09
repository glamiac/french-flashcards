import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'flashcards/:mode',
        loadComponent: () => import('./features/flashcards/flashcard-viewer/flashcard-viewer.component').then(m => m.FlashcardViewerComponent)
    },
    {
        path: 'stats',
        loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent)
    },
    {
        path: 'dictionary',
        loadComponent: () => import('./features/dictionary/dictionary.component').then(m => m.DictionaryComponent)
    },
    { path: '**', redirectTo: '' }
];
