const fs = require('fs');

const controllers = [
    './src/controllers/auth.controller.js',
    './src/controllers/admin.controller.js',
    './src/controllers/user.controller.js'
];

controllers.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');

        // Replace all occurrences
        content = content.replace(/= async \(req, res\) => \{/g, '= async (req, res, next) => {');

        fs.writeFileSync(file, content);
        console.log(`✅ Fixed: ${file}`);
    } catch (err) {
        console.error(`❌ Error fixing ${file}:`, err.message);
    }
});

console.log('\n🎉 All controller files updated!');
console.log('⚠️  Now restart your server: npm start\n');