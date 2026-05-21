const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

app.use(cors());
app.use(express.json());

// Proxy requests to the AI service
app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling AI service:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'AI Service Error',
            details: error.message
        });
    }
});

app.get('/api/options', async (req, res) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/options`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching options:', error.message);
        res.status(500).json({ error: 'Failed to fetch options' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
