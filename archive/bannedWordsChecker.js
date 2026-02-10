const fs = require('fs');

// Define your banned words here (lowercase for consistency with the check)
const bannedWordsRaw = fs.readFileSync('bannedWords.txt', 'utf8');
const bannedWords = bannedWordsRaw.split('\n').map(word => word.trim()).filter(word => word.length > 0).map(word => word.toLowerCase());

function analyzeWords() {
  try {
    // Read the input file
    const text = fs.readFileSync('../full.txt', 'utf8');
    
    // Create banned set for O(1) lookups (mimic original function)
    const bannedSet = new Set(bannedWords);
    
    // Split on word boundaries, same as original
    const words = text.split(/\b/);
    
    // Process each word
    const outputLines = [];
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length > 0) {
        const isBanned = bannedSet.has(cleanWord.toLowerCase()) ? 1 : 0;
        outputLines.push(`${cleanWord.toLowerCase()}, ${isBanned}`);
      }
    }
    
    // Write to output file
    fs.writeFileSync('words_analysis.txt', outputLines.join('\n'));
    console.log(`Analysis complete. Output written to words_analysis.txt (${outputLines.length} words processed).`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the analysis
analyzeWords();