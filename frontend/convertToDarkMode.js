// convertToDarkMode.js - Script Node.js pour conversion automatique
const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { from: /\bbg-white\b(?!.*dark:)/g, to: 'bg-white dark:bg-gray-800' },
  { from: /\bbg-gray-50\b(?!.*dark:)/g, to: 'bg-gray-50 dark:bg-gray-900' },
  { from: /\bbg-gray-100\b(?!.*dark:)/g, to: 'bg-gray-100 dark:bg-gray-800' },
  { from: /\bbg-gray-200\b(?!.*dark:)/g, to: 'bg-gray-200 dark:bg-gray-700' },
  
  // Textes
  { from: /\btext-gray-900\b(?!.*dark:)/g, to: 'text-gray-900 dark:text-white' },
  { from: /\btext-gray-700\b(?!.*dark:)/g, to: 'text-gray-700 dark:text-gray-200' },
  { from: /\btext-gray-600\b(?!.*dark:)/g, to: 'text-gray-600 dark:text-gray-300' },
  { from: /\btext-gray-500\b(?!.*dark:)/g, to: 'text-gray-500 dark:text-gray-400' },
  { from: /\btext-gray-400\b(?!.*dark:)/g, to: 'text-gray-400 dark:text-gray-500' },
  
  // Bordures
  { from: /\bborder-gray-200\b(?!.*dark:)/g, to: 'border-gray-200 dark:border-gray-700' },
  { from: /\bborder-gray-300\b(?!.*dark:)/g, to: 'border-gray-300 dark:border-gray-600' },
  
  // Hovers
  { from: /\bhover:bg-gray-100\b(?!.*dark:)/g, to: 'hover:bg-gray-100 dark:hover:bg-gray-700' },
  { from: /\bhover:bg-gray-50\b(?!.*dark:)/g, to: 'hover:bg-gray-50 dark:hover:bg-gray-800' },
  { from: /\bhover:text-gray-900\b(?!.*dark:)/g, to: 'hover:text-gray-900 dark:hover:text-white' },
  
  // Placeholders et inputs
  { from: /\bplaceholder-gray-500\b(?!.*dark:)/g, to: 'placeholder-gray-500 dark:placeholder-gray-400' },
];

function convertFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Converti: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return false;
  }
}

function convertDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalConverted = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      totalConverted += convertDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      if (convertFile(fullPath)) {
        totalConverted++;
      }
    }
  });
  
  return totalConverted;
}

// Usage
const srcPath = path.join(__dirname, 'src');
console.log('🚀 Début de la conversion...');
const converted = convertDirectory(srcPath);
console.log(`\n🎉 Conversion terminée ! ${converted} fichiers modifiés.`);

// Pour exécuter ce script :
// 1. Sauvegardez-le comme convertToDarkMode.js à la racine de votre projet
// 2. Exécutez : node convertToDarkMode.js