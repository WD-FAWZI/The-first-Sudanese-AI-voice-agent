
export default async function handler(req, res) {
    // CORS Configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-password'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Authentication Check
    const adminPassword = process.env.ADMIN_PASSWORD;
    const providedPassword = req.headers['x-admin-password'];

    if (!adminPassword) {
        console.error("ADMIN_PASSWORD environment variable is not set.");
        return res.status(500).json({ error: "Server Configuration Error" });
    }

    if (providedPassword !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { type } = req.query;
    const VAPI_BASE_URL = 'https://api.vapi.ai';
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
    const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

    if (!VAPI_PRIVATE_KEY || !ASSISTANT_ID) {
        console.error("Vapi credentials missing in environment variables.");
        return res.status(500).json({ error: "Server Configuration Error: Missing Vapi Keys" });
    }

    const headers = {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
    };

    try {
        // ----------------------------------------------------------------------
        // GET /api/vapi/assistant -> Fetch Assistant Config
        // ----------------------------------------------------------------------
        if (req.method === 'GET' && type === 'assistant') {
            const response = await fetch(`${VAPI_BASE_URL}/assistant/${ASSISTANT_ID}`, {
                method: 'GET',
                headers,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch assistant');
            return res.status(200).json(data);
        }

        // ----------------------------------------------------------------------
        // PATCH /api/vapi/assistant -> Update Assistant Config
        // ----------------------------------------------------------------------
        if (req.method === 'PATCH' && type === 'assistant') {
            const response = await fetch(`${VAPI_BASE_URL}/assistant/${ASSISTANT_ID}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(req.body),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update assistant');
            return res.status(200).json(data);
        }

        // ----------------------------------------------------------------------
        // GET /api/vapi/calls -> Fetch Call Logs
        // ----------------------------------------------------------------------
        if (req.method === 'GET' && type === 'calls') {
            const limit = req.query.limit || 10;
            const response = await fetch(`${VAPI_BASE_URL}/call?assistantId=${ASSISTANT_ID}&limit=${limit}`, {
                method: 'GET',
                headers,
            });

            let data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch calls');

            // Ensure data is an array (API might wrap it)
            if (!Array.isArray(data)) {
                // Some APIs return { results: [...] } or similar.
                // Vapi usually returns an array for /call, but let's be safe.
                // If it's paginated, it might be in data.results
                data = data.results || data.calls || [];
                if (!Array.isArray(data)) data = [];
            }

            return res.status(200).json(data);
        }

        return res.status(400).json({ error: "Invalid request type or method" });

    } catch (error) {
        console.error("Vapi Proxy Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
