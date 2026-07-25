import { EngineeringObject } from './EngineeringObject';

export interface EngineeringContextState {
  selectedEngineeringObject: EngineeringObject;
  setSelectedEngineeringObject: (object: EngineeringObject) => void;
}
