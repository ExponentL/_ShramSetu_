import { GovernmentVerificationProvider, GovernmentProviderConfig } from '../types';
import { CLCProvider } from './CLCProvider';
import { EShramProvider } from './EShramProvider';
import { StateLabourProvider } from './StateLabourProvider';
import { OtherAuthorizedProvider } from './OtherAuthorizedProvider';

/**
 * GovernmentProviderFactory
 *
 * Resolves and manages official Government Verification Providers without hard-coding
 * the platform around any single authority.
 *
 * Supported providers:
 * - CLC (Chief Labour Commissioner - Central)
 * - e-Shram (National Unorganized Worker Database)
 * - State Labour Department (State BOCW / Labour Welfare Boards)
 * - Other Authorized Government Provider
 *
 * Strict Compliance:
 * - Providers remain disabled (enabled: false) until authentic official credentials
 *   and base URLs are explicitly supplied.
 */
export class GovernmentProviderFactory {
  public static normalizeProviderCode(code?: string): string {
    const raw = (code || process.env.GOVERNMENT_PROVIDER || 'CLC').toUpperCase().trim();
    if (raw === 'E_SHRAM' || raw === 'ESHRAM') return 'ESHRAM';
    if (raw === 'STATE_LABOUR' || raw === 'STATE' || raw === 'BOCW') return 'STATE_LABOUR';
    if (raw === 'OTHER_AUTHORIZED' || raw === 'OTHER' || raw === 'AUTHORIZED') return 'OTHER_AUTHORIZED';
    return 'CLC';
  }

  public static getProvider(
    providerType?: string,
    customOptions?: Partial<GovernmentProviderConfig>
  ): GovernmentVerificationProvider {
    const code = this.normalizeProviderCode(providerType);

    switch (code) {
      case 'ESHRAM':
        return new EShramProvider(customOptions);
      case 'STATE_LABOUR':
        return new StateLabourProvider(customOptions);
      case 'OTHER_AUTHORIZED':
        return new OtherAuthorizedProvider(customOptions);
      case 'CLC':
      default:
        return new CLCProvider(customOptions);
    }
  }

  public static getAllProviderConfigs(): GovernmentProviderConfig[] {
    const clc = new CLCProvider();
    const eshram = new EShramProvider();
    const stateLabour = new StateLabourProvider();
    const other = new OtherAuthorizedProvider();

    return [
      clc.getConfig(),
      eshram.getConfig(),
      stateLabour.getConfig(),
      other.getConfig(),
    ];
  }

  public static getProviderConfig(providerCode: string): GovernmentProviderConfig | null {
    const code = this.normalizeProviderCode(providerCode);
    const provider = this.getProvider(code);
    return provider.getConfig();
  }

  public static isAnyProviderConfigured(): boolean {
    const clc = new CLCProvider();
    const eshram = new EShramProvider();
    const stateLabour = new StateLabourProvider();
    const other = new OtherAuthorizedProvider();

    return (
      clc.isConfigured() ||
      eshram.isConfigured() ||
      stateLabour.isConfigured() ||
      other.isConfigured()
    );
  }

  public static isAnyProviderEnabled(): boolean {
    const clc = new CLCProvider();
    const eshram = new EShramProvider();
    const stateLabour = new StateLabourProvider();
    const other = new OtherAuthorizedProvider();

    return (
      clc.isEnabled() ||
      eshram.isEnabled() ||
      stateLabour.isEnabled() ||
      other.isEnabled()
    );
  }
}
