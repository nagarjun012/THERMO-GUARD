import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global error boundary that catches rendering errors anywhere in the tree
 * and shows a recovery UI instead of crashing the entire app.
 * Critical for native apps where a white screen = uninstall.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Log to console for debugging; in production you'd send to a crash reporting service
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-blue-200/80 shadow-2xl p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto bg-red-100 border border-red-200 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950 font-mono mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                The application encountered an unexpected error. Your data is safe — tap below to recover.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-left">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRetry}
                className="w-full py-3 px-4 rounded-xl font-mono text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl font-mono text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-[0.98] transition-all"
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
