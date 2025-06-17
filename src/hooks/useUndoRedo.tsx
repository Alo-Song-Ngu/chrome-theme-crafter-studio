
import { useState, useCallback } from 'react';

interface UseUndoRedoOptions<T> {
  initialState: T;
  maxHistoryLength?: number;
}

export const useUndoRedo = <T,>({ 
  initialState, 
  maxHistoryLength = 50 
}: UseUndoRedoOptions<T>) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const pushState = useCallback((newState: T) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    // Limit history length
    if (newHistory.length > maxHistoryLength) {
      newHistory.shift();
    } else {
      setCurrentIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, currentIndex, maxHistoryLength]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    state: currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: history.length
  };
};
