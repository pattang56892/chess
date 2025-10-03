import { useState, useCallback } from 'react';
import { chessAPI } from '../services/api';

export const useAnalysis = () => {
  const [topMoves, setTopMoves] = useState([]);
  const [evaluation, setEvaluation] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = useCallback(async (fen) => {
    setIsAnalyzing(true);
    try {
      const data = await chessAPI.analyzePosition(fen);
      setTopMoves(data.top_moves);
      setEvaluation(data.position_evaluation);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getHint = useCallback(async () => {
    const data = await chessAPI.getHint();
    return data.hint_san;
  }, []);

  return { topMoves, evaluation, isAnalyzing, analyze, getHint };
};
