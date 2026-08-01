import React, { useState, useEffect } from 'react';
import { EngineeringNodeItem, DUMMY_ENGINEERING_HIERARCHY } from './dummyEngineeringHierarchy';
import { EngineeringTreeNode } from './EngineeringTreeNode';
import { useEngineeringContext } from '../context/useEngineeringContext';
import { organizationService } from '../../../services/organizationService';
import { projectService } from '../../../services/projectService';
import { assetService } from '../../../services/assetService';
import { regionService } from '../../../services/regionService';
import { deploymentZoneService } from '../../../services/deploymentZoneService';
import { engineeringNodeService } from '../../../services/engineeringNodeService';

interface EngineeringTreeProps {
  data?: EngineeringNodeItem[];
}

interface HierarchyEntity {
  id?: string;
  name?: string;
  code?: string;
  organizationId?: string;
  projectId?: string;
  assetId?: string;
  regionId?: string;
  deploymentZoneId?: string;
  projectName?: string;
  projectCode?: string;
  assetName?: string;
  assetCode?: string;
  regionName?: string;
  regionCode?: string;
  zoneName?: string;
  zoneCode?: string;
  nodeCode?: string;
  nodeNumber?: number;
  formattedChainage?: string;
}

const buildEngineeringTree = (
  organizations: HierarchyEntity[],
  projects: HierarchyEntity[],
  assets: HierarchyEntity[],
  regions: HierarchyEntity[],
  zones: HierarchyEntity[],
  nodes: HierarchyEntity[]
): EngineeringNodeItem[] => {
  return organizations.map((org) => {
    const orgProjects = projects.filter((p) => p.organizationId === org.id);

    const projectItems: EngineeringNodeItem[] = orgProjects.map((proj) => {
      const projAssets = assets.filter((a) => a.projectId === proj.id);

      const assetItems: EngineeringNodeItem[] = projAssets.map((ast) => {
        const astRegions = regions.filter((r) => r.assetId === ast.id);

        const regionItems: EngineeringNodeItem[] = astRegions.map((reg) => {
          const regZones = zones.filter((z) => z.regionId === reg.id);

          const zoneItems: EngineeringNodeItem[] = regZones.map((zn) => {
            const znNodes = nodes.filter((n) => n.deploymentZoneId === zn.id);

            const nodeItems: EngineeringNodeItem[] = znNodes.map((nd) => ({
              id: nd.id || `node-${nd.nodeCode}`,
              name: `Engineering Node ${nd.nodeCode || nd.formattedChainage || nd.nodeNumber}`,
              type: 'NODE'
            }));

            return {
              id: zn.id || `zone-${zn.zoneCode}`,
              name: zn.zoneName || `Zone ${zn.zoneCode}`,
              type: 'DEPLOYMENT_ZONE',
              children: nodeItems.length > 0 ? nodeItems : undefined
            };
          });

          return {
            id: reg.id || `region-${reg.regionCode}`,
            name: reg.regionName || `Region ${reg.regionCode}`,
            type: 'REGION',
            children: zoneItems.length > 0 ? zoneItems : undefined
          };
        });

        return {
          id: ast.id || `asset-${ast.assetCode}`,
          name: ast.assetName || `Asset ${ast.assetCode}`,
          type: 'ASSET',
          children: regionItems.length > 0 ? regionItems : undefined
        };
      });

      return {
        id: proj.id || `proj-${proj.projectCode}`,
        name: proj.projectName || `Project ${proj.projectCode}`,
        type: 'PROJECT',
        children: assetItems.length > 0 ? assetItems : undefined
      };
    });

    return {
      id: org.id || `org-${org.code}`,
      name: org.name || `Organization ${org.code}`,
      type: 'ORGANIZATION',
      children: projectItems.length > 0 ? projectItems : undefined
    };
  });
};

export const EngineeringTree: React.FC<EngineeringTreeProps> = ({
  data
}) => {
  const { selectedEngineeringObject, setSelectedEngineeringObject } = useEngineeringContext();

  const [treeData, setTreeData] = useState<EngineeringNodeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCompleteHierarchy = async () => {
      setLoading(true);
      setError(null);
      try {
        const orgs = await organizationService.getAll();
        const projs = await projectService.getAll();
        const asts = await assetService.getAll();

        const rawOrganizations = orgs || [];
        const rawProjects = projs || [];
        const rawAssets = asts || [];

        // Load Regions for each Asset
        const rawRegions = [];
        for (const ast of rawAssets) {
          if (ast.id) {
            const regs = await regionService.getByAssetId(ast.id);
            if (regs) rawRegions.push(...regs);
          }
        }

        // Load Deployment Zones for each Region
        const rawZones = [];
        for (const reg of rawRegions) {
          if (reg.id) {
            const zones = await deploymentZoneService.getByRegionId(reg.id);
            if (zones) rawZones.push(...zones);
          }
        }

        // Load Engineering Nodes for each Deployment Zone
        const rawNodes = [];
        for (const zone of rawZones) {
          if (zone.id) {
            const nodes = await engineeringNodeService.getByDeploymentZoneId(zone.id);
            if (nodes) rawNodes.push(...nodes);
          }
        }

        if (isMounted) {
          const assembledTree = buildEngineeringTree(
            rawOrganizations,
            rawProjects,
            rawAssets,
            rawRegions,
            rawZones,
            rawNodes
          );

          if (assembledTree && assembledTree.length > 0) {
            setTreeData(assembledTree);
          } else {
            // Fallback to initial dummy tree if backend repositories have 0 configured nodes
            setTreeData(DUMMY_ENGINEERING_HIERARCHY);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load complete hierarchy data';
          setError(errorMessage);
          // Preserve baseline workspace tree if network/backend is offline
          setTreeData(DUMMY_ENGINEERING_HIERARCHY);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCompleteHierarchy();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const activeTree = data && data.length > 0 ? data : treeData;

  if (loading && activeTree.length === 0) {
    return (
      <div style={{ padding: '16px', fontSize: '12px', color: '#64748B' }}>
        Loading engineering hierarchy...
      </div>
    );
  }

  if (error && activeTree.length === 0) {
    return (
      <div style={{ padding: '16px', fontSize: '12px', color: '#DC2626' }}>
        Hierarchy load error: {error}
      </div>
    );
  }

  if (!activeTree || activeTree.length === 0) {
    return (
      <div style={{ padding: '16px', fontSize: '12px', color: '#64748B', fontStyle: 'italic' }}>
        No engineering hierarchy configured.
      </div>
    );
  }

  return (
    <div className="veriq-nav-tree-scroll">
      {activeTree.map((rootNode: EngineeringNodeItem) => (
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
