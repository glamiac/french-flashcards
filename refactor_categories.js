const fs = require('fs');

const inputFile = 'public/flashcards.json';
const backupFile = 'public/flashcards.backup.json';

// Load data
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Backup
if (!fs.existsSync(backupFile)) {
    fs.copyFileSync(inputFile, backupFile);
    console.log('Backup created.');
}

// Ordered List of Categories (Priority Matters: Specific -> General)
const categoryRules = [
    // --- Society & Lifestyle ---
    {
        cat: 'Politics & Government',
        keywords: ['politics', 'political', 'government', 'minister', 'president', 'deputy', 'senator', 'state', 'nation', 'national', 'republic', 'democracy', 'election', 'vote', 'candidate', 'party', 'campaign', 'policy', 'council', 'parliament', 'congress', 'mayor', 'governor', 'official', 'administration', 'authority', 'power', 'regime', 'border', 'territory', 'diplomat', 'diplomacy', 'crisis', 'strike', 'international', 'coup', 'legislature', 'socialism', 'majority']
    },
    {
        cat: 'Law & Justice',
        keywords: ['law', 'justice', 'legal', 'illegal', 'court', 'judge', 'lawyer', 'attorney', 'jury', 'trial', 'crime', 'criminal', 'prison', 'jail', 'guard', 'police', 'cop', 'officer', 'security', 'arrest', 'investigation', 'evidence', 'proof', 'guilty', 'innocent', 'right', 'rule', 'regulation', 'ban', 'prohibit', 'witness', 'victim', 'suspect', 'statement']
    },
    {
        cat: 'Economics & Business',
        keywords: ['economy', 'economic', 'business', 'company', 'firm', 'enterprise', 'industry', 'market', 'trade', 'commerce', 'finance', 'financial', 'bank', 'money', 'cash', 'currency', 'euro', 'dollar', 'cent', 'cost', 'price', 'value', 'pay', 'payment', 'budget', 'debt', 'tax', 'profit', 'loss', 'invest', 'investment', 'share', 'stock', 'sale', 'sell', 'buy', 'customer', 'client', 'manager', 'employee', 'employer', 'salary', 'wage', 'job', 'work', 'career', 'contract', 'deal', 'insurance', 'account', 'bill', 'check', 'office', 'corporate', 'management', 'project', 'development', 'production', 'product', 'brand', 'marketing', 'interest', 'sold', 'offer']
    },
    {
        cat: 'Media & Communication',
        keywords: ['media', 'news', 'newspaper', 'journal', 'magazine', 'article', 'report', 'reporter', 'journalist', 'press', 'radio', 'television', 'tv', 'broadcast', 'channel', 'internet', 'web', 'site', 'email', 'message', 'text', 'phone', 'telephone', 'call', 'screen', 'network', 'signal', 'communication', 'communicate', 'letter', 'mail', 'post', 'stamp', 'envelope', 'information', 'info', 'data', 'computer', 'software', 'program', 'file', 'cassette', 'audio-visual', 'click', 'link']
    },
    {
        cat: 'Sports & Hobbies',
        keywords: ['sport', 'game', 'play', 'player', 'team', 'match', 'ball', 'soccer', 'football', 'tennis', 'golf', 'gym', 'exercise', 'run', 'race', 'jump', 'swim', 'ski', 'club', 'hobby', 'collect', 'toy', 'doll', 'card', 'chess', 'puzzle', 'win', 'lose', 'score', 'competition', 'stadium', 'fan', 'coach']
    },
    {
        cat: 'Social & Interaction',
        keywords: ['meeting', 'meet', 'visit', 'party', 'celebration', 'festival', 'event', 'social', 'society', 'community', 'group', 'club', 'member', 'relationship', 'friendship', 'interaction', 'conversation', 'discussion', 'chat', 'interview', 'appointment', 'invitation', 'guest', 'host', 'help', 'service', 'support', 'public', 'crowd', 'together', 'alone', 'presence', 'role', 'personnel', 'meeting', 'cocktail']
    },

    // --- Nature & World ---
    {
        cat: 'Space & Elements',
        keywords: ['space', 'universe', 'planet', 'star', 'sun', 'moon', 'sky', 'earth', 'world', 'fire', 'flame', 'water', 'ice', 'steam', 'air', 'wind', 'cloud', 'rain', 'snow', 'storm', 'weather', 'climate', 'heat', 'cold', 'nature', 'light', 'dark', 'shadow', 'smoke', 'dust', 'surface']
    },
    {
        cat: 'Geography & Places',
        keywords: ['geography', 'place', 'location', 'area', 'zone', 'region', 'country', 'city', 'town', 'village', 'capital', 'island', 'mountain', 'hill', 'valley', 'river', 'lake', 'ocean', 'sea', 'beach', 'coast', 'shore', 'forest', 'wood', 'jungle', 'desert', 'field', 'ground', 'land', 'soil', 'map', 'north', 'south', 'east', 'west', 'direction', 'left', 'right', 'street', 'road', 'avenue', 'square', 'park', 'neighborhood', 'railway', 'elsewhere', 'abroad']
    },
    {
        cat: 'Animals & Nature',
        keywords: ['animal', 'dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'chicken', 'mouse', 'rat', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'monkey', 'rabbit', 'insect', 'fly', 'bee', 'spider', 'snake', 'pet', 'wild', 'farm', 'zoo', 'plant', 'tree', 'flower', 'leaf', 'root', 'branch', 'grass', 'garden', 'rose', 'cage']
    },

    // --- Daily Life & Objects ---
    {
        cat: 'Food & Drink',
        keywords: ['food', 'drink', 'eat', 'hungry', 'thirsty', 'bread', 'water', 'coffee', 'tea', 'milk', 'juice', 'wine', 'beer', 'alcohol', 'fruit', 'vegetable', 'meat', 'chicken', 'beef', 'pork', 'fish', 'egg', 'cheese', 'butter', 'sugar', 'salt', 'pepper', 'spice', 'sauce', 'oil', 'breakfast', 'lunch', 'dinner', 'supper', 'meal', 'snack', 'restaurant', 'cafe', 'bar', 'menu', 'waiter', 'cook', 'chef', 'kitchen', 'recipe', 'bake', 'roast', 'fry', 'boil', 'plate', 'bowl', 'dish', 'cup', 'glass', 'bottle', 'can', 'fork', 'spoon', 'knife', 'napkin', 'table', 'soup', 'salad', 'cake', 'pie', 'chocolate', 'sweet', 'candy', 'cereal']
    },
    {
        cat: 'Clothing & Fashion',
        keywords: ['clothing', 'clothes', 'wear', 'dress', 'shirt', 'pants', 'trousers', 'jeans', 'skirt', 'coat', 'jacket', 'suit', 'tie', 'hat', 'cap', 'shoe', 'boot', 'sock', 'glove', 'scarf', 'belt', 'pocket', 'button', 'zipper', 'fashion', 'style', 'size', 'fit', 'sew', 'fabric', 'cotton', 'wool', 'silk', 'leather', 'ring', 'jewelry', 'bag', 'purse', 'wallet', 'umbrella']
    },
    {
        cat: 'Home & Housing',
        keywords: ['home', 'house', 'housing', 'apartment', 'flat', 'building', 'address', 'room', 'bedroom', 'living', 'bathroom', 'kitchen', 'hall', 'floor', 'wall', 'ceiling', 'roof', 'door', 'window', 'stair', 'furniture', 'bed', 'sofa', 'couch', 'chair', 'table', 'desk', 'lamp', 'light', 'mirror', 'carpet', 'rug', 'curtain', 'towel', 'soap', 'clean', 'dirty', 'wash', 'rent', 'neighbor', 'toilet', 'bath', 'shower']
    },
    {
        cat: 'Technology & Tools',
        keywords: ['technology', 'tech', 'machine', 'engine', 'motor', 'device', 'appliance', 'tool', 'hammer', 'nail', 'screw', 'drill', 'saw', 'science', 'computer', 'laptop', 'tablet', 'phone', 'software', 'hardware', 'data', 'digital', 'electric', 'electricity', 'energy', 'power', 'battery', 'fuel', 'gas', 'oil', 'robot', 'automatic']
    },
    {
        cat: 'Transportation',
        keywords: ['transport', 'transportation', 'travel', 'trip', 'journey', 'vehicle', 'car', 'auto', 'bus', 'truck', 'van', 'taxi', 'train', 'subway', 'metro', 'plane', 'airplane', 'flight', 'airport', 'station', 'stop', 'ticket', 'passenger', 'driver', 'pilot', 'ride', 'drive', 'fly', 'sail', 'boat', 'ship', 'bicycle', 'bike', 'motorcycle', 'road', 'street', 'highway', 'traffic', 'wheel', 'tire', 'garage', 'parking']
    },

    // --- People & Body ---
    {
        cat: 'Family & Relationships',
        keywords: ['family', 'parent', 'mother', 'mom', 'father', 'dad', 'sister', 'brother', 'son', 'daughter', 'child', 'kid', 'baby', 'grandparent', 'grandmother', 'grandfather', 'husband', 'wife', 'spouse', 'partner', 'couple', 'marriage', 'marry', 'wedding', 'divorce', 'single', 'friend', 'relationship', 'love', 'date', 'kiss', 'hug', 'uncle', 'aunt', 'cousin', 'nephew', 'niece']
    },
    {
        cat: 'People & Roles',
        keywords: ['people', 'person', 'human', 'man', 'men', 'woman', 'women', 'boy', 'girl', 'guy', 'lady', 'gentleman', 'adult', 'kid', 'teenager', 'youth', 'elder', 'crowd', 'group', 'team', 'member', 'leader', 'follower', 'citizen', 'resident', 'guest', 'visitor', 'stranger', 'enemy', 'victim', 'hero', 'king', 'queen', 'prince', 'princess', 'soldier', 'army', 'military', 'boss', 'chief', 'mister', 'madam', 'foreigner', 'american', 'promoter', 'albanian', 'bosnian']
    },
    {
        cat: 'Body & Health',
        keywords: ['body', 'head', 'face', 'eye', 'hair', 'nose', 'mouth', 'lip', 'tooth', 'teeth', 'tongue', 'ear', 'neck', 'shoulder', 'arm', 'hand', 'finger', 'thumb', 'chest', 'breast', 'back', 'stomach', 'belly', 'waist', 'leg', 'knee', 'foot', 'feet', 'toe', 'skin', 'bone', 'muscle', 'blood', 'heart', 'brain', 'lung', 'health', 'healthy', 'sick', 'ill', 'illness', 'disease', 'pain', 'hurts', 'injury', 'wound', 'cut', 'doctor', 'nurse', 'patient', 'hospital', 'clinic', 'medicine', 'drug', 'pill', 'treatment', 'cure', 'life', 'live', 'birth', 'born', 'death', 'die', 'dead', 'sleep', 'dream', 'tired', 'weak', 'strong', 'physical']
    },

    // --- Education & Arts ---
    {
        cat: 'School & Education',
        keywords: ['school', 'education', 'university', 'college', 'class', 'course', 'lesson', 'subject', 'teacher', 'professor', 'student', 'pupil', 'learn', 'study', 'teach', 'exam', 'test', 'pass', 'fail', 'grade', 'mark', 'degree', 'diploma', 'homework', 'library', 'book', 'textbook', 'notebook', 'pen', 'pencil', 'paper', 'read', 'write', 'draw', 'question', 'answer', 'problem', 'solution', 'science', 'math', 'history', 'art', 'music', 'language', 'english', 'french', 'research']
    },
    {
        cat: 'Arts & Culture',
        keywords: ['art', 'culture', 'museum', 'gallery', 'painting', 'sculpture', 'artist', 'music', 'musician', 'song', 'sing', 'singer', 'band', 'concert', 'instrument', 'guitar', 'piano', 'dance', 'dancer', 'theater', 'theatre', 'play', 'actor', 'actress', 'stage', 'movie', 'film', 'cinema', 'screen', 'video', 'camera', 'photo', 'photograph', 'picture', 'image', 'poem', 'poetry', 'novel', 'story', 'literature', 'writer', 'author', 'religion', 'god', 'church', 'temple', 'faith', 'belief', 'pray', 'prayer', 'holy', 'sacred', 'bible']
    },

    // --- Describing / Qualities ---
    {
        cat: 'Qualities & Traits',
        keywords: ['good', 'bad', 'better', 'best', 'worse', 'worst', 'great', 'excellent', 'fine', 'nice', 'kind', 'mean', 'happy', 'sad', 'beautiful', 'pretty', 'ugly', 'clean', 'dirty', 'rich', 'poor', 'expensive', 'cheap', 'fast', 'quick', 'slow', 'hard', 'difficult', 'easy', 'soft', 'strong', 'weak', 'hot', 'cold', 'warm', 'cool', 'new', 'old', 'young', 'long', 'short', 'high', 'tall', 'low', 'big', 'large', 'small', 'little', 'tiny', 'heavy', 'light', 'fat', 'thin', 'thick', 'wide', 'narrow', 'empty', 'full', 'open', 'closed', 'wet', 'dry', 'early', 'late', 'busy', 'free', 'ready', 'sure', 'certain', 'true', 'false', 'real', 'fake', 'right', 'wrong', 'simple', 'complex', 'safe', 'dangerous', 'important', 'major', 'minor', 'public', 'private', 'general', 'special', 'able', 'unable', 'possible', 'impossible', 'same', 'different', 'similar', 'own', 'unique', 'ancient', 'former', 'clear', 'numerous', 'particular', 'unfavorable', 'vigilant', 'regular', 'viable', 'barbaric', 'atrocious', 'smart', 'productive', 'thoughtful', 'insignificant', 'interdependent', 'serious', 'handsome', 'average', 'visible', 'invisible', 'active', 'passive', 'positive', 'negative', 'final', 'last', 'first', 'main', 'principal', 'only', 'single', 'various', 'several', 'other', 'another', 'such', 'own', 'general', 'current', 'present']
    },

    // --- Abstract & Concepts ---
    {
        cat: 'Time & History',
        keywords: ['time', 'date', 'calendar', 'schedule', 'clock', 'watch', 'hour', 'minute', 'second', 'moment', 'past', 'present', 'future', 'history', 'era', 'age', 'period', 'century', 'decade', 'year', 'month', 'week', 'day', 'morning', 'afternoon', 'evening', 'night', 'tonight', 'today', 'tomorrow', 'yesterday', 'now', 'then', 'before', 'after', 'early', 'late', 'soon', 'ago', 'forever', 'always', 'never', 'sometimes', 'often', 'usually', 'rarely', 'during', 'since', 'until', 'while', 'current', 'recent', 'ancient']
    },
    {
        cat: 'Quantity & Numbers',
        keywords: ['number', 'count', 'amount', 'quantity', 'total', 'sum', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million', 'billion', 'first', 'second', 'third', 'last', 'single', 'double', 'pair', 'couple', 'half', 'quarter', 'all', 'none', 'some', 'many', 'much', 'few', 'little', 'less', 'more', 'most', 'least', 'increase', 'decrease', 'measure']
    },
    {
        cat: 'Colors & Shapes',
        keywords: ['color', 'colour', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'people', 'black', 'white', 'gray', 'grey', 'brown', 'pink', 'silver', 'gold', 'light', 'dark', 'bright', 'pale', 'shape', 'form', 'circle', 'square', 'triangle', 'rectangle', 'round', 'line', 'point', 'straight', 'curve']
    },
    {
        cat: 'Emotions & Feelings',
        keywords: ['emotion', 'feeling', 'feel', 'happy', 'happiness', 'sad', 'sadness', 'glad', 'joy', 'angry', 'anger', 'mad', 'upset', 'afraid', 'fear', 'scared', 'frightened', 'brave', 'courage', 'calm', 'nervous', 'anxious', 'worry', 'worried', 'excited', 'bored', 'tired', 'sleepy', 'surprised', 'shocked', 'proud', 'shame', 'guilt', 'sorry', 'love', 'hate', 'like', 'dislike', 'prefer', 'want', 'wish', 'hope', 'desire', 'passion', 'pleasure', 'pain', 'suffer', 'cry', 'laugh', 'smile', 'fun', 'enjoy', 'pride', 'despair', 'serenity', 'agitation']
    },
    {
        cat: 'Thoughts & Mental',
        keywords: ['think', 'thought', 'mind', 'brain', 'know', 'knowledge', 'understand', 'understanding', 'believe', 'belief', 'doubt', 'guess', 'imagine', 'imagination', 'remember', 'memory', 'forget', 'decide', 'decision', 'choose', 'choice', 'plan', 'idea', 'opinion', 'view', 'attitude', 'focus', 'attention', 'notice', 'realize', 'recognize', 'wonder', 'consider', 'suppose', 'agree', 'disagree', 'correct', 'wrong', 'true', 'false', 'truth', 'lie', 'secret', 'sense', 'logic', 'reason', 'meaning', 'obsession', 'know-how']
    },
    {
        cat: 'Abstract Concepts',
        keywords: ['life', 'death', 'beginning', 'end', 'start', 'finish', 'problem', 'solution', 'trouble', 'difficulty', 'issue', 'matter', 'situation', 'condition', 'state', 'case', 'circumstance', 'fact', 'reality', 'dream', 'fantasy', 'mystery', 'luck', 'chance', 'fortune', 'risk', 'danger', 'safety', 'security', 'protection', 'freedom', 'liberty', 'independence', 'peace', 'war', 'victory', 'defeat', 'success', 'failure', 'theory', 'practice', 'system', 'method', 'way', 'manner', 'style', 'type', 'kind', 'sort', 'category', 'class', 'group', 'set', 'list', 'series', 'level', 'degree', 'stage', 'step', 'quality', 'quantity', 'force', 'power', 'energy', 'strength', 'weakness', 'ability', 'skill', 'talent', 'thing', 'stuff', 'object', 'item', 'piece', 'part', 'portion', 'section', 'segment', 'side', 'top', 'bottom', 'center', 'middle', 'edge', 'corner', 'result', 'effect', 'cause', 'action', 'name', 'need', 'means', 'order', 'word', 'example', 'term', 'detail', 'rest', 'effort', 'title', 'base', 'ammunition', 'harmonization', 'average', 'compression']
    },

    // --- Actions (Specific) ---
    {
        cat: 'Movement & Place',
        keywords: ['go', 'come', 'arrive', 'leave', 'depart', 'return', 'enter', 'exit', 'walk', 'run', 'jump', 'fly', 'swim', 'ride', 'drive', 'crawl', 'climb', 'fall', 'drop', 'lift', 'raise', 'lower', 'push', 'pull', 'carry', 'move', 'stay', 'remain', 'wait', 'stop', 'stand', 'sit', 'lie', 'lay', 'cross', 'pass', 'follow', 'lead']
    },
    {
        cat: 'Communication Actions',
        keywords: ['say', 'tell', 'ask', 'answer', 'reply', 'speak', 'talk', 'discuss', 'argue', 'shout', 'whisper', 'call', 'cry', 'laugh', 'scream', 'write', 'read', 'listen', 'hear', 'describe', 'explain', 'suggest', 'promise', 'offer', 'refuse', 'accept', 'thank', 'apologize', 'greet', 'meet', 'introduce']
    },
    {
        cat: 'Creation & Doing',
        keywords: ['do', 'make', 'create', 'build', 'construct', 'form', 'produce', 'prepare', 'fix', 'repair', 'mend', 'break', 'destroy', 'cut', 'tear', 'open', 'close', 'shut', 'begin', 'start', 'end', 'finish', 'complete', 'continue', 'keep', 'hold', 'give', 'take', 'get', 'receive', 'find', 'lose', 'search', 'look', 'try', 'attempt', 'work', 'play', 'act', 'serve', 'use', 'help', 'support']
    },

    // --- Grammar & Basics ---
    {
        cat: 'Grammar & Function',
        keywords: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'article', 'determiner', 'subject', 'object', 'tense', 'plural', 'singular', 'feminine', 'masculine']
    },
    {
        cat: 'Prepositions & Places',
        keywords: ['in', 'inside', 'into', 'out', 'outside', 'on', 'off', 'at', 'by', 'near', 'nearby', 'next', 'far', 'away', 'from', 'to', 'toward', 'up', 'down', 'above', 'over', 'below', 'under', 'beneath', 'between', 'among', 'through', 'across', 'around', 'behind', 'front', 'before', 'after', 'against', 'with', 'without', 'about', 'for', 'of']
    },
    {
        cat: 'Pronouns & Determiners',
        keywords: ['i', 'me', 'my', 'mine', 'myself', 'you', 'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'we', 'us', 'our', 'ours', 'ourselves', 'they', 'them', 'their', 'theirs', 'themselves', 'this', 'that', 'these', 'those', 'which', 'what', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'here', 'there', 'every', 'each', 'any', 'some', 'no', 'none', 'all', 'both', 'either', 'neither', 'another', 'other', 'such']
    },
    {
        cat: 'Connectors & Essentials',
        keywords: ['and', 'but', 'or', 'so', 'because', 'as', 'if', 'unless', 'until', 'while', 'when', 'where', 'since', 'though', 'although', 'even', 'just', 'only', 'maybe', 'perhaps', 'probably', 'possibly', 'yes', 'no', 'not', 'never', 'ever', 'always', 'still', 'yet', 'already', 'again', 'then', 'than', 'too', 'very', 'quite', 'rather', 'almost', 'nearly', 'enough']
    }
];

const processed = data.map(card => {
    let newCategory = 'General Knowledge'; // Default fallback
    const translation = card.translation.toLowerCase();
    const tokens = translation.split(/[ ;,\(\)\.]+/); // Tokenize

    let matched = false;

    // 1. Try Keyword Matching (Ordered Priority)
    for (const rule of categoryRules) {
        // Check if ANY keyword matches ANY token (exact match preferred for short words)
        // For phrases? "to go" -> tokens ["to", "go"]. "go" matches.

        if (rule.keywords.some(k => tokens.includes(k))) {
            newCategory = rule.cat;
            matched = true;
            break;
        }

        // Multi-word checks? (e.g. "bus stop"). 
        // Simple token matching usually works if keyword is "bus".
    }

    // 2. Fallbacks for Unmatched
    if (!matched) {
        if (translation.startsWith('to ')) {
            newCategory = 'Creation & Doing'; // Generic Actions
        } else if (translation.endsWith('ly')) { // likely adverb
            newCategory = 'Connectors & Essentials';
        } else {
            // Keep original hints if useful?
            const oldCat = card.category;
            if (oldCat.includes('Adjective') || oldCat === 'Describing') matchCategory = 'Quality & Traits'; // Map old Describing to Quality
            else if (oldCat.includes('Verb') || oldCat === 'Actions') matchCategory = 'Creation & Doing';
            else newCategory = 'General Knowledge';
        }
    }

    return { ...card, category: newCategory };
});


// Statistics
const stats = {};
processed.forEach(c => stats[c.category] = (stats[c.category] || 0) + 1);
console.log('Detailed Categories:', stats);

fs.writeFileSync(inputFile, JSON.stringify(processed, null, 2));
