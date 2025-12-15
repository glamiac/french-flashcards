const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/flashcards.json', 'utf8'));

const actions = data.filter(c => c.category === 'Actions');
const verbs = data.filter(c => c.category === 'Verb');
const toStart = data.filter(c => c.translation.startsWith('to '));

console.log('Total Actions:', actions.length);
console.log('Total Verbs:', verbs.length);
console.log('Total starting with "to ":', toStart.length);

if (actions.length === 0 && toStart.length > 0) {
    console.log('Sample "to " cards categories:', toStart.slice(0, 10).map(c => `${c.translation} -> ${c.category}`));
}
