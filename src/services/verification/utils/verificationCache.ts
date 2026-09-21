import { NormalizedGovernmentResponse } from '../types';

interface CacheEntry {
  response: NormalizedGovernmentResponse;
  expiresAt: number;
  cachedAt: number;
}

/**
 * VerificationCache
 *
 * In-memory cache for official government verification queries.
 * Prevents unnecessary continuous API calls to official government systems.
 * Supports TTL-based invalidation and controlled manual rechecks.
 */
export class VerificationCache {
  private cache = new Map<string, CacheEntry>();
  private defaultTtlMs = 24 * 60 * 60 * 1000; // 24 hours default
  private hits = 0;
  private misses = 0;

  constructor(defaultTtlMs?: number) {
    if (defaultTtlMs && defaultTtlMs > 0) {
      this.defaultTtlMs = defaultTtlMs;
    }
  }

  private buildKey(providerCode: string, reference: string): string {
    return `${providerCode.toUpperCase().trim()}:${reference.trim().toUpperCase()}`;
  }

  /**
   * Retrieves a cached verification response if present and not expired.
   */
  public get(providerCode: string, reference: string): NormalizedGovernmentResponse | null {
    if (!reference) return null;
    const key = this.buildKey(providerCode, reference);
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.response;
  }

  /**
   * Stores a normalized verification response.
   * Only caches deterministic states (VERIFIED, NOT_VERIFIED).
   * Does NOT cache transient technical failures (SERVICE_UNAVAILABLE, AUTHENTICATION_ERROR).
   */
  public set(
    providerCode: string,
    reference: string,
    response: NormalizedGovernmentResponse,
    ttlMs?: number
  ): void {
    if (!reference) return;

    // Do NOT cache transient technical failures or unconfigured states
    if (
      response.status === 'SERVICE_UNAVAILABLE' ||
      response.status === 'AUTHENTICATION_ERROR' ||
      response.status === 'NOT_CONFIGURED' ||
      response.status === 'PENDING'
    ) {
      return;
    }

    const key = this.buildKey(providerCode, reference);
    const duration = ttlMs && ttlMs > 0 ? ttlMs : this.defaultTtlMs;
    const now = Date.now();

    this.cache.set(key, {
      response,
      cachedAt: now,
      expiresAt: now + duration,
    });
  }

  /**
   * Invalidates a cached verification entry to allow controlled manual recheck.
   */
  public invalidate(providerCode: string, reference: string): boolean {
    const key = this.buildKey(providerCode, reference);
    return this.cache.delete(key);
  }

  /**
   * Clears the entire cache.
   */
  public clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Returns cache metrics for monitoring.
   */
  public getStats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
    };
  }
}

export const defaultVerificationCache = new VerificationCache();

