import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private parseErrorDetails(): {
    displayMessage: string;
    isQuotaExceeded: boolean;
    isDailyReadQuota: boolean;
  } {
    let raw = this.state.errorMessage;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.error === 'string') {
        raw = parsed.error;
      }
    } catch {
      // Plain text error
    }

    const isDailyReadQuota = raw.includes(
      "Quota exceeded for quota metric 'Free daily read units per project (free tier database)'"
    );
    const isQuotaExceeded = isDailyReadQuota || raw.toLowerCase().includes('quota exceeded');

    return {
      displayMessage: raw,
      isQuotaExceeded,
      isDailyReadQuota,
    };
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { displayMessage, isQuotaExceeded, isDailyReadQuota } = this.parseErrorDetails();
    const upgradeUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data?openUpgradeDialog=true`;

    return (
      <div className="min-h-screen bg-[#05070f] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500/70 rounded-2xl p-6 shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h1 className="font-pixel text-base sm:text-lg text-rose-400 mb-2">
            Connection / Data Error
          </h1>

          <p className="font-retro text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {isQuotaExceeded
              ? 'Firestore free-tier daily quota has been reached. Quota resets tomorrow, or you can review Spark/Blaze plan limits.'
              : 'Something went wrong while communicating with the database.'}
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left text-[11px] font-retro text-slate-400 break-words mb-5 max-h-32 overflow-y-auto">
            {displayMessage}
          </div>

          {isDailyReadQuota && (
            <a
              href={upgradeUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[44px] mb-3 px-4 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-retro text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Firebase Console Upgrade</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full min-h-[44px] px-5 py-2.5 bg-pink-500 hover:bg-pink-400 text-slate-950 font-pixel text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </div>
    );
  }
}
