import { randomBytes, scryptSync } from 'node:crypto';

function readHiddenPassword() {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Run this command in an interactive terminal.');
  }

  process.stdout.write('Admin password (12+ characters): ');
  input.setRawMode(true);
  input.resume();

  return new Promise((resolve, reject) => {
    let password = '';
    const finish = (error) => {
      input.removeListener('data', onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(password);
    };
    const onData = (chunk) => {
      const value = chunk.toString('utf8');
      if (value.includes('\u0003')) return finish(new Error('Cancelled.'));
      if (value.includes('\r') || value.includes('\n')) return finish();
      if (value.includes('\u007f') || value.includes('\b')) {
        password = Array.from(password).slice(0, -1).join('');
        return;
      }
      password += value;
    };
    input.on('data', onData);
  });
}

const password = await readHiddenPassword();
if (password.length < 12) {
  throw new Error('Choose a password with at least 12 characters.');
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
process.stdout.write(`scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}\n`);