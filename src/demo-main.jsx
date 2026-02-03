import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoPage from './Demo';
import ErrorBoundary from './ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <DemoPage />
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
