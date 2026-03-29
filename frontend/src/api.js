import axios from 'axios';

// Ensure the local dev server points to the Express API (running concurrently on port 5000)
const API_URL = 'http://localhost:5000/api';

export const uploadResumes = async (formData) => {
    return axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const getCandidates = async () => {
    return axios.get(`${API_URL}/candidates`);
};
