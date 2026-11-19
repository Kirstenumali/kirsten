// Run locally to replace only the admin password; preserve all workspace data.
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
if (!process.argv.includes('--confirm')) {
  console.error('Run node reset-local-admin.js --confirm to reset the local admin password.');
  process.exit(1);
}
const directory = path.resolve(process.env.WORK_DASHBOARD_DATA_DIR || path.join(os.homedir(), '.bugbountycompany'));
const file = path.join(directory, 'work.json');
const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { workers: [], tasks: [] };
const password = crypto.randomBytes(15).toString('base64url');
const salt = crypto.randomBytes(16).toString('hex');
data.admin = { salt, passwordHash: crypto.scryptSync(password, salt, 64).toString('hex') };
fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
fs.writeFileSync(file + '.tmp', JSON.stringify(data), { mode: 0o600 });
fs.renameSync(file + '.tmp', file);
console.log('Local admin username: admin');
console.log('New local admin password: ' + password);
console.log('Users, tasks, posts, and document records preserved. Restart the local dashboard to clear old sessions.');
