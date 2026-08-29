import * as crypto from 'crypto';

export function generateUUID(): string {
  return crypto.randomUUID(); // SRS-FR-005
}

export function getCurrentISOString(): string {
  return new Date().toISOString(); // SRS-I18N-001
}

export function computeSHA256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function sanitizeEntityKey(rawKey: string): string {
  return rawKey.trim().toLowerCase();
}
