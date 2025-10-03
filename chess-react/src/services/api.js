import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const chessAPI = {
  newGame: async () => {
    const response = await axios.post(`${API_BASE}/new_game`);
    return response.data;
  },
  
  makeMove: async (move) => {
    const response = await axios.post(`${API_BASE}/make_move`, { move });
    return response.data;
  },
  
  analyzePosition: async (fen) => {
    const response = await axios.post(`${API_BASE}/analyze_position`, { fen });
    return response.data;
  },
  
  getHint: async () => {
    const response = await axios.get(`${API_BASE}/hint`);
    return response.data;
  }
};
