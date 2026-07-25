import { useContext } from 'react';
import { EngineeringContext } from './EngineeringContext';
import { EngineeringContextState } from './EngineeringContextTypes';

export const useEngineeringContext = (): EngineeringContextState => {
  const context = useContext(EngineeringContext);
  if (!context) {
    throw new Error('useEngineeringContext must be used within an EngineeringContextProvider');
  }
  return context;
};
