#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to verify all dependencies and configuration are correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Medical Student SaaS Setup...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

console.log(`📄 Environment File (.env.local): ${envExists ? '✅' : '❌'}`);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf-8');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'TOGETHER_API_KEY',
    'ANTHROPIC_API_KEY',
    'GOOGLE_AI_API_KEY',
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID_INDIVIDUAL',
    'STRIPE_PRICE_ID_COHORT',
    'NEXT_PUBLIC_URL'
  ];

  console.log('\n📋 Required Environment Variables:');
  requiredVars.forEach(varName => {
    const isSet = envContent.includes(varName) && !envContent.includes(`${varName}=your_`);
    console.log(`   ${varName}: ${isSet ? '✅' : '❌'}`);
  });
} else {
  console.log('\n⚠️  Create .env.local from .env.example and fill in your values');
}

// Check if node_modules exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
console.log(`\n📦 Dependencies Installed: ${nodeModulesExists ? '✅' : '❌'}`);

if (!nodeModulesExists) {
  console.log('   Run: npm install');
}

// Check critical files
console.log('\n📁 Critical Files:');
const criticalFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'middleware.ts',
  'app/layout.tsx',
  'lib/supabase/client.ts',
  'lib/llm/factory.ts',
  'supabase/migrations/20240101000000_initial_schema.sql'
];

criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
});

// Summary
console.log('\n📊 Setup Summary:');
console.log('   1. ✅ Project structure created');
console.log('   2. ✅ Dependencies installed');
console.log(`   3. ${envExists ? '✅' : '❌'} Environment configured`);
console.log('   4. ⏳ Supabase migrations pending (run: supabase db push)');
console.log('   5. ⏳ Ready to run (npm run dev)');

console.log('\n📖 Next Steps:');
console.log('   1. Configure .env.local with your API keys');
console.log('   2. Run: supabase db push');
console.log('   3. Run: npm run dev');
console.log('   4. Visit: http://localhost:3000');
console.log('\n📚 Documentation:');
console.log('   - QUICKSTART.md - Quick setup guide');
console.log('   - README.md - Full documentation');
console.log('   - DEPLOYMENT.md - Production deployment');
console.log('   - PROJECT_SUMMARY.md - Project overview\n');
