const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Helper function to serve index.html (SPA Fallback)
function serveIndex(response, cause) {
    console.log(`[SPA Fallback] Serving index.html because: ${cause}`);
    fs.readFile('./index.html', function (error, content) {
        if (!error) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
        } else {
            response.writeHead(500);
            response.end('Critical Error: index.html not found.', 'utf-8');
        }
    });
}

const server = http.createServer(function (request, response) {
    console.log('Request:', request.url);

    // Normalize path
    let filePath = '.' + request.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Remove query strings if any
    filePath = filePath.split('?')[0];

    // Get extension
    let extname = String(path.extname(filePath)).toLowerCase();

    // MIME type lookup
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Try to read the file
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                // File missing. Check strategies:

                // 1. Clean URL check (e.g. /demo -> /demo.html)
                if (!extname) { // If no extension provided
                    const htmlPath = filePath + '.html';
                    if (fs.existsSync(htmlPath)) {
                        console.log('[Clean URL] Serving:', htmlPath);
                        fs.readFile(htmlPath, function (err, htmlContent) {
                            if (!err) {
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                response.end(htmlContent, 'utf-8');
                            } else {
                                serveIndex(response, 'Clean URL read failed');
                            }
                        });
                        return;
                    }
                }

                // 2. SPA Fallback (Serve index.html for everything else)
                serveIndex(response, 'File not found ' + filePath);
            } else {
                // Actual Server Error
                response.writeHead(500);
                response.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            // Success - Serve file
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Server running locally!`);
    console.log(`📡 URL: http://localhost:${PORT}/`);
    console.log(`💡 Press Ctrl+C to stop.\n`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use.`);
        console.error(`👉 Try running this command to kill old processes: npx kill-port ${PORT}`);
    } else {
        console.error('Server Error:', e);
    }
});
