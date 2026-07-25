import { createContext } from 'react';
import { EngineeringContextState } from './EngineeringContextTypes';

export const EngineeringContext = createContext<EngineeringContextState | undefined>(undefined);
