import { createContext } from 'react';
import { SynchronizedContextState } from './EngineeringContextTypes';

export const EngineeringContext = createContext<SynchronizedContextState | undefined>(undefined);
