import React from "react"

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-xl font-semibold text-neutral-800 mb-2">Something went wrong</h1>
                    <p className="text-sm text-neutral-500 mb-4">An unexpected error occurred. Please try refreshing the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 text-sm bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
                    >
                        Refresh page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
