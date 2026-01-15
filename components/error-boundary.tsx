"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false })} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  onReset: () => void
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#ff0057] font-arcade">
            SYSTEM ERROR
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#ff0057] to-[#2196f3]" />
        </div>

        <div className="bg-[#0a0a14] border border-[#2196f3]/30 p-6 space-y-4 relative">
          <p className="text-white/80 font-terminal">
            Ein unerwarteter Fehler ist aufgetreten.
          </p>

          {error && (
            <pre className="text-xs text-[#ff0057]/70 bg-black/50 p-3 overflow-auto max-h-32 text-left border border-[#ff0057]/20">
              {error.message}
            </pre>
          )}

          <button
            onClick={onReset}
            className="crt-button px-6 py-3 text-sm hover:bg-[#ff0057]/20 transition-colors"
          >
            ERNEUT VERSUCHEN
          </button>

          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff0057]" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff0057]" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff0057]" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff0057]" />
        </div>

        <p className="text-xs text-white/40">
          Falls das Problem weiterhin besteht, lade die Seite neu.
        </p>
      </div>
    </div>
  )
}

export default ErrorBoundary
