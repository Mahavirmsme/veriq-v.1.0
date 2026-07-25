import React from 'react';
import { EngineeringNodeItem } from './dummyEngineeringHierarchy';
import { ChevronRight, ChevronDown, Building, Folder, Layers, MapPin, Cpu, Radio } from 'lucide-react';

interface EngineeringTreeNodeProps {
  node: EngineeringNodeItem;
  level: number;
  expandedIds: Set<string>;
  selectedId: string;
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: EngineeringNodeItem) => void;
}

export const EngineeringTreeNode: React.FC<EngineeringTreeNodeProps> = ({
  node,
  level,
  expandedIds,
  selectedId,
  onToggleExpand,
  onSelectNode
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  const handleNodeClick = () => {
    onSelectNode(node);
  };

  // Node type icon
  const getNodeIcon = () => {
    switch (node.type) {
      case 'ORGANIZATION':
        return <Building size={14} color={isSelected ? '#FFFFFF' : '#60A5FA'} />;
      case 'PROJECT':
        return <Folder size={14} color={isSelected ? '#FFFFFF' : '#38BDF8'} />;
      case 'ASSET':
        return <Layers size={14} color={isSelected ? '#FFFFFF' : '#34D399'} />;
      case 'REGION':
        return <MapPin size={14} color={isSelected ? '#FFFFFF' : '#FBBF24'} />;
      case 'DEPLOYMENT_ZONE':
        return <Cpu size={14} color={isSelected ? '#FFFFFF' : '#F472B6'} />;
      case 'NODE':
      default:
        return <Radio size={14} color={isSelected ? '#FFFFFF' : '#A78BFA'} />;
    }
  };

  return (
    <div>
      <div
        className={`veriq-tree-node-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${8 + level * 14}px` }}
        onClick={handleNodeClick}
      >
        {/* Toggle Arrow */}
        <span className="veriq-tree-expand-icon" onClick={handleExpandClick}>
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <span style={{ width: 14 }} />
          )}
        </span>

        {/* Node Icon */}
        <span className="veriq-tree-type-icon">
          {getNodeIcon()}
        </span>

        {/* Node Name */}
        <span className="veriq-tree-node-text">
          {node.name}
        </span>
      </div>

      {/* Render Children Recursively */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <EngineeringTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
