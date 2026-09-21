/**
 * Verification Provider Manager / Abstraction Layer
 *
 * Sits between Verification Service and the concrete Government Providers:
 *   Verification Service -> Verification Provider -> Mock Government Provider (or Official Authorized API)
 *
 * Decouples the service business logic from the underlying gateway implementation.
 */

import {
  IGovernmentVerificationProvider,
  SafeVerificationResponse,
  VerificationSimulationState,
  VerificationRequestPayload,
} from './types';
import { MockGovernmentProvider } from './mockGovernmentProvider';

export class VerificationProvider {
  private activeProvider: IGovernmentVerificationProvider;
  private readonly providers: Map<string, IGovernmentVerificationProvider> = new Map();

  constructor(defaultProvider?: IGovernmentVerificationProvider) {
    const mock = defaultProvider || new MockGovernmentProvider();
    this.activeProvider = mock;
    this.registerProvider(mock);
  }

  /**
   * Register a provider into the provider registry.
   */
  public registerProvider(provider: IGovernmentVerificationProvider): void {
    this.providers.set(provider.providerId, provider);
  }

  /**
   * Switch the active provider (e.g. from Mock to Official Authorized in production).
   */
  public setActiveProvider(providerId: string): void {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Verification provider '${providerId}' is not registered.`);
    }
    this.activeProvider = provider;
  }

  /**
   * Get the current active provider.
   */
  public getActiveProvider(): IGovernmentVerificationProvider {
    return this.activeProvider;
  }

  /**
   * Delegate verification request to the active provider.
   */
  public async requestVerification(
    workerId: string,
    payload?: VerificationRequestPayload
  ): Promise<SafeVerificationResponse> {
    return this.activeProvider.requestVerification(workerId, payload);
  }

  /**
   * Delegate fetch request to the active provider.
   */
  public async fetchWorkerVerification(workerId: string): Promise<SafeVerificationResponse | null> {
    return this.activeProvider.fetchWorkerVerification(workerId);
  }

  /**
   * Delegate admin manual status override to the active provider.
   */
  public async overrideStatus(
    workerId: string,
    status: VerificationSimulationState,
    adminNotes?: string
  ): Promise<SafeVerificationResponse> {
    return this.activeProvider.overrideStatus(workerId, status, adminNotes);
  }
}

// Global singleton provider instance
export const defaultVerificationProvider = new VerificationProvider();

