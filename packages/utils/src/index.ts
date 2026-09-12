import * as crypto from 'crypto';

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID(); // SRS-FR-005
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
