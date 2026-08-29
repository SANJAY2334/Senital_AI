export function maskSecret(secretValue?: string, visibleChars: number = 4): string {
  if (!secretValue) return '***';
  if (secretValue.length <= visibleChars) return '***';
  const prefix = secretValue.substring(0, visibleChars);
  return `${prefix}***-MASKED`;
}

export function maskConfigObject<T extends Record<string, unknown>>(config: T, secretKeys: string[] = ['KMS_MASTER_KEY_ID', 'DATABASE_PASSWORD', 'KAFKA_CLIENT_SECRET']): T {
  const maskedObj = { ...config } as Record<string, unknown>;
  for (const key of Object.keys(maskedObj)) {
    if (secretKeys.includes(key) && typeof maskedObj[key] === 'string') {
      maskedObj[key] = maskSecret(maskedObj[key] as string);
    }
  }
  return maskedObj as T;
}
