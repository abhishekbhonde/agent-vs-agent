import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const startDebate = async (topic) => {
    const response = await axios.post(`${API_URL}/debate/start`, { topic });
    return response.data;
};

export const runTurn = async (debateId, agent) => {
    const response = await axios.post(`${API_URL}/debate/turn`, { debateId, agent });
    return response.data;
};

export const voteWinner = async (debateId, winner) => {
    const response = await axios.post(`${API_URL}/debate/vote`, { debateId, winner });
    return response.data;
};
