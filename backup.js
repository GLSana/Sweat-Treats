import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Backup function
const backupDatabase = () => {
  try {
    const dbPath = path.join(__dirname, 'cake_business.db');
    const backupDir = path.join(__dirname, 'backups');
    
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `cake_business_${timestamp}.db`);
    
    // Copy database file
    fs.copyFileSync(dbPath, backupPath);
    
    console.log(`Database backed up to: ${backupPath}`);
    
    // Keep only last 10 backups
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('cake_business_'))
      .sort()
      .reverse();
    
    if (files.length > 10) {
      files.slice(10).forEach(file => {
        fs.unlinkSync(path.join(backupDir, file));
        console.log(`Removed old backup: ${file}`);
      });
    }
  } catch (error) {
    console.error('Backup failed:', error);
  }
};

// Run backup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  backupDatabase();
}

export { backupDatabase }; 