const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/flashcards.json', 'utf8'));

const largeCats = ['General Knowledge', 'Objects & Concepts', 'Actions', 'Essentials'];
const buckets = {};

data.forEach(c => {
    if (largeCats.includes(c.category)) {
        if (!buckets[c.category]) buckets[c.category] = [];
        buckets[c.category].push(c.translation);
    }
});

console.log('--- General Knowledge Sample (100) ---');
console.log(buckets['General Knowledge']?.slice(0, 100));

console.log('\n--- Objects & Concepts Sample (100) ---');
console.log(buckets['Objects & Concepts']?.slice(0, 100));
