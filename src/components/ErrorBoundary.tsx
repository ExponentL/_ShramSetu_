import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2, ShieldCheck, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ShramSetu ErrorBoundary caught an unhandled error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      const keysToClear = [
        'shramsetu_current_user',
        'coop_workers',
        'coop_bookings',
        'coop_reviews',
        'coop_complaints',
        'coop_welfare',
        'coop_forecasts',
        'coop_gov_verifications',
      ];
      keysToClear.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch (_) {}
      });
      // Also clear all shramsetu keys if any
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('coop_') || k.startsWith('shramsetu_')) {
          try {
            localStorage.removeItem(k);
          } catch (_) {}
        }
      });
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          id="shramsetu-error-boundary"
          className="min-h-screen bg-[#FAF8F5] text-neutral-900 flex flex-col justify-between font-sans selection:bg-neutral-900 selection:text-white"
        >
          {/* Header */}
          <header className="border-b border-[#E2DFD8] bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#167A5B] text-white flex items-center justify-center font-black text-sm tracking-tighter">
                SS
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-extrabold text-neutral-900 tracking-tight">
                  ShramSetu
                </span>
                <span className="text-xs text-neutral-500 font-sans">
                  श्रमसेतु
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Application Recovery Mode
            </span>
          </header>

          {/* Center Card */}
          <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-xl bg-white border border-[#E2DFD8] rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Something went wrong
                </h1>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  An unexpected issue occurred while rendering the page. You can reload the page or reset the local cache to restore standard operation.
                </p>
                <p className="text-xs text-neutral-500">
                  पेज लोड करने में समस्या आई। कृपया पुनः प्रयास करें।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  id="error-boundary-reload-btn"
                  onClick={this.handleReload}
                  className="px-5 py-2.5 rounded-xl bg-[#167A5B] hover:bg-[#13664c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reload Page
                </button>

                <button
                  type="button"
                  id="error-boundary-reset-btn"
                  onClick={this.handleResetStorage}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm border border-[#E2DFD8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-neutral-500" />
                  Reset Local Data & Restart
                </button>
              </div>

              {/* Collapsible Error Details */}
              {this.state.error && (
                <details className="mt-4 text-left border border-neutral-200 rounded-xl p-3 bg-neutral-50/50">
                  <summary className="text-xs font-semibold text-neutral-600 cursor-pointer hover:text-neutral-900">
                    Technical Error Details
                  </summary>
                  <div className="mt-2 text-[11px] font-mono text-red-700 overflow-x-auto whitespace-pre-wrap bg-white p-2.5 rounded-lg border border-neutral-200 max-h-48 overflow-y-auto">
                    <strong>Error:</strong> {this.state.error.name}: {this.state.error.message}
                    {this.state.error.stack && (
                      <div className="mt-2 text-neutral-600 text-[10px]">
                        {this.state.error.stack}
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-[#E2DFD8] bg-white px-4 py-3 text-center text-xs text-neutral-500">
            ShramSetu Democratic Cooperative Platform • Safe Session Recovery
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}

