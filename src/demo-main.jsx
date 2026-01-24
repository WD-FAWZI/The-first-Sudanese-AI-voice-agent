import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoPage from './Demo';
import ErrorBoundary from './ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <DemoPage />
        </ErrorBoundary>
    </React.StrictMode>
);
