const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/flashcards.json', 'utf8'));

const categories = {};
const nounM = [];
const nounF = [];
const verbs = [];

data.forEach(card => {
    categories[card.category] = (categories[card.category] || 0) + 1;
    if (card.category === 'Noun (Masculine)') nounM.push(card.translation);
    if (card.category === 'Noun (Feminine)') nounF.push(card.translation);
    if (card.category === 'Verb') verbs.push(card.translation);
});

console.log('Current Category Counts:', categories);
console.log('Sample Noun M:', nounM.slice(0, 20));
console.log('Sample Noun F:', nounF.slice(0, 20));
console.log('Sample Verbs:', verbs.slice(0, 20));
