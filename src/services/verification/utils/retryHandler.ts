/**
 * Retry Handler with Exponential Backoff
 *
 * Designed specifically for official government integration gateways.
 * Retries transient failures (e.g., connection reset, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).
 * Strictly avoids retrying 401 Unauthorized, 403 Forbidden, or 404 Not Found.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: any) => void;
}

export async function executeWithRetry<T>(
  fn: (attempt: number) => Promise<T>,
  isTransientError: (error: any) => boolean,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 2;
  const initialDelayMs = options.initialDelayMs ?? 300;
  const maxDelayMs = options.maxDelayMs ?? 2000;
  const backoffFactor = options.backoffFactor ?? 2;

  let attempt = 0;
  let delay = initialDelayMs;

  while (true) {
    attempt++;
    try {
      return await fn(attempt);
    } catch (err: any) {
      const isTransient = isTransientError(err);
      if (attempt > maxRetries || !isTransient) {
        throw err;
      }

      if (options.onRetry) {
        options.onRetry(attempt, err);
      }

      // Wait with jitter
      const jitter = Math.floor(Math.random() * 50);
      const sleepTime = Math.min(delay + jitter, maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));

      delay = Math.min(delay * backoffFactor, maxDelayMs);
    }
  }
}

