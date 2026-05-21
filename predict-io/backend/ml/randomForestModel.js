const axios = require('axios');

/**
 * RandomForestModel Wrapper
 * Interfaces with the Python AI microservice.
 */

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

const getPrediction = async (data) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/predict`, data);
        return response.data;
    } catch (error) {
        throw new Error('AI Engine Synchronization Error');
    }
};

const getModelOptions = async () => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/options`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to retrieve model parameters');
    }
};

module.exports = {
    getPrediction,
    getModelOptions
};
