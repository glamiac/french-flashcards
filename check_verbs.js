const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/flashcards.json', 'utf8'));

const verbs = data.filter(c => c.category === 'Verb');
console.log('Remaining Verbs:', verbs.map(c => c.translation));
