import React, { useState } from 'react';
import { EngineeringNodeItem, DUMMY_ENGINEERING_HIERARCHY } from './dummyEngineeringHierarchy';
import { EngineeringTreeNode } from './EngineeringTreeNode';
import { useEngineeringContext } from '../context/useEngineeringContext';

interface EngineeringTreeProps {
  data?: EngineeringNodeItem[];
}

export const EngineeringTree: React.FC<EngineeringTreeProps> = ({
  data = DUMMY_ENGINEERING_HIERARCHY
}) => {
  const { selectedEngineeringObject, setSelectedEngineeringObject } = useEngineeringContext();

  // Default expanded root & project nodes
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(['org-bihar-wrd', 'proj-kosi-flood-2026', 'asset-kosi-left-embankment']);
  });

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectNode = (node: EngineeringNodeItem) => {
    setSelectedEngineeringObject({
      id: node.id,
      name: node.name,
      type: node.type,
      parentObject: 'Kosi Embankment Protection Project',
      hierarchyPath: `Water Resources Department Bihar > ${node.name}`,
      hasChildren: !!(node.children && node.children.length > 0)
    });
  };

  return (
    <div className="veriq-nav-tree-scroll">
      {data.map((rootNode) => (
        <EngineeringTreeNode
          key={rootNode.id}
          node={rootNode}
          level={0}
          expandedIds={expandedIds}
          selectedId={selectedEngineeringObject.id}
          onToggleExpand={handleToggleExpand}
          onSelectNode={handleSelectNode}
        />
      ))}
    </div>
  );
};
