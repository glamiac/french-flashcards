const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/flashcards.json', 'utf8'));

const general = data.filter(c => c.category === 'General Knowledge').map(c => c.translation);

console.log('General Knowledge Total:', general.length);
console.log('Sample:', general.slice(0, 50));
console.log('Sample End:', general.slice(-50));
