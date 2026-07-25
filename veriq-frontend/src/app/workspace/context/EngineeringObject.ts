import { EngineeringNodeType } from '../navigation/dummyEngineeringHierarchy';

export interface EngineeringObject {
  id: string;
  name: string;
  type: EngineeringNodeType;
  parentObject?: string;
  hierarchyPath: string;
  hasChildren: boolean;
}
