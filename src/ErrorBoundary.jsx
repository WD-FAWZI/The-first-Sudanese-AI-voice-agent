import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#050505',
                    color: '#fff',
                    fontFamily: 'sans-serif',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <h1 style={{ color: '#ff4d4f' }}>عذراً، حدث خطأ ما</h1>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>
                        نواجه مشكلة بسيطة. يرجى محاولة تحديث الصفحة.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        تحديث الصفحة
                    </button>

                    <details style={{ marginTop: '20px', textAlign: 'left', opacity: 0.5, fontSize: '12px' }}>
                        <summary>تفاصيل الخطأ (للمطورين)</summary>
                        <pre>{this.state.error && this.state.error.toString()}</pre>
                        <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
