#!/usr/bin/env node

/**
 * 🔐 Permission Management CLI
 * 
 * Developer'lar için permission yönetim komutları
 * 
 * Kullanım:
 *   npm run permissions:sync     - Config'den DB'ye sync
 *   npm run permissions:check    - Config vs DB karşılaştırması
 *   npm run permissions:list     - Tüm permission'ları listele
 *   npm run permissions:validate - Config dosyasını doğrula
 */

const { execSync } = require('child_process');

const commands = {
  sync: {
    description: '🔄 Config dosyasından veritabanına GÜVENLI permission sync et (ID\'ler korunur)',
    command: 'npx tsx prisma/safe_permissions_sync.ts'
  },
  'force-sync': {
    description: '⚠️  YIKICI SYNC - Tüm permission\'ları sil ve yeniden oluştur (SADECE DEV!)',
    command: 'npx tsx prisma/seed_permissions_from_config.ts'
  },
  check: {
    description: '🔍 Config vs DB karşılaştırması yap',
    command: 'npx tsx lib/permissions/scripts/check-permissions.ts'
  },
  list: {
    description: '📋 Tüm permission\'ları listele',
    command: 'npx tsx lib/permissions/scripts/list-permissions.ts'
  },
  validate: {
    description: '✅ Config dosyasını doğrula',
    command: 'npx tsx lib/permissions/scripts/validate-permissions.ts'
  },

  dev: {
    description: '🚀 Development helper - tüm validasyonları çalıştır',
    command: 'npm run permissions:validate && npm run permissions:check'
  },
  help: {
    description: '❓ Bu yardım mesajını göster',
    command: null
  }
};

function showHelp() {
  console.log('🔐 Permission Management CLI\n');
  console.log('Available commands:\n');

  Object.entries(commands).forEach(([cmd, info]) => {
    console.log(`  npm run permissions:${cmd.padEnd(10)} - ${info.description}`);
  });

  console.log('\nDeveloper Notes:');
  console.log('• Permission eklemek/çıkarmak için lib/permissions/config.ts dosyasını düzenle');
  console.log('• Değişiklikten sonra "npm run permissions:sync" komutunu çalıştır');
  console.log('• Permission sistemi hakkında detaylı bilgi: lib/permissions/README.md');
  console.log('');
}

function executeCommand(command) {
  try {
    console.log(`🏃 Executing: ${command}\n`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

// Ana komut işleyici
const command = process.argv[2];

if (!command || command === 'help') {
  showHelp();
  process.exit(0);
}

if (commands[command]) {
  if (commands[command].command) {
    executeCommand(commands[command].command);
  } else {
    showHelp();
  }
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.log('Use "npm run permissions help" to see available commands');
  process.exit(1);
}