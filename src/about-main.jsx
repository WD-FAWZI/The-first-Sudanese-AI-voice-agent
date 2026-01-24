import React from 'react';
import ReactDOM from 'react-dom/client';
import AboutPage from './About';
import ErrorBoundary from './ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AboutPage />
        </ErrorBoundary>
    </React.StrictMode>
);
