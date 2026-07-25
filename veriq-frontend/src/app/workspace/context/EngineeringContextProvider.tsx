import React, { useState } from 'react';
import { EngineeringContext } from './EngineeringContext';
import { EngineeringObject } from './EngineeringObject';

export const DEFAULT_ENGINEERING_OBJECT: EngineeringObject = {
  id: 'asset-kosi-left-embankment',
  name: 'Kosi Left Flood Embankment',
  type: 'ASSET',
  parentObject: 'Kosi Embankment Protection Project',
  hierarchyPath: 'Water Resources Department Bihar > Kosi Embankment Protection Project > Kosi Left Flood Embankment',
  hasChildren: true
};

export const EngineeringContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEngineeringObject, setSelectedEngineeringObject] = useState<EngineeringObject>(DEFAULT_ENGINEERING_OBJECT);

  return (
    <EngineeringContext.Provider
      value={{
        selectedEngineeringObject,
        setSelectedEngineeringObject
      }}
    >
      {children}
    </EngineeringContext.Provider>
  );
};
