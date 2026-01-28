import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proxyHandler from './api/vapi-proxy.js';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Adapter to convert Express req/res to Vercel-like handler
app.all('/api/vapi-proxy', async (req, res) => {
    // Vercel functions often use these helpers which Express provides
    // but just to be safe, we pass req, res directly as our handler supports standard usage.
    await proxyHandler(req, res);
});

app.listen(PORT, () => {
    console.log(`Local API Server running at http://localhost:${PORT}`);
});
