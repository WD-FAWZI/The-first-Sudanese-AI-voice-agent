import React from 'react';
import ReactDOM from 'react-dom/client';
import AboutPage from './About';
import ErrorBoundary from './ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AboutPage />
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
