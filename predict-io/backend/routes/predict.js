const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('@clerk/express');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5000';

router.post('/predict', requireAuth(), async (req, res) => {
    console.log('[API] /api/predict POST request received');
    console.log('[API] Headers:', req.headers);
    console.log('[API] Body:', req.body);
    try {
        console.log(`[API] Sending prediction request to AI Service at ${AI_SERVICE_URL}/predict`);
        const response = await axios.post(`${AI_SERVICE_URL}/predict`, req.body);
        console.log('[API] AI Service response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('[API] Prediction error occurred!');
        if (error.response) {
            console.error('[API] Error Status:', error.response.status);
            console.error('[API] Error Data:', error.response.data);
        } else {
            console.error('[API] Error Message:', error.message);
            console.error('[API] Error Stack:', error.stack);
        }
        res.status(500).json({ 
            error: 'AI Service Communication Error', 
            details: error.message,
            backendError: error.response?.data?.error || null
        });
    }
});

const OPTIONS_PATH = path.join(__dirname, '../ml/options.json');

router.get('/options', async (req, res) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/options`);
        res.json(response.data);
    } catch (error) {
        console.warn(`[API] AI Service is offline at ${AI_SERVICE_URL}. Falling back to local options.json:`, error.message);
        try {
            if (fs.existsSync(OPTIONS_PATH)) {
                const data = fs.readFileSync(OPTIONS_PATH, 'utf8');
                return res.json(JSON.parse(data));
            }
        } catch (fsError) {
            console.error('[API] Local options fallback also failed:', fsError.message);
        }
        res.status(500).json({ error: 'Failed to fetch options' });
    }
});

module.exports = router;
