export type EngineeringNodeType = 
  | 'ORGANIZATION'
  | 'PROJECT'
  | 'ASSET'
  | 'REGION'
  | 'DEPLOYMENT_ZONE'
  | 'NODE';

export interface EngineeringNodeItem {
  id: string;
  name: string;
  type: EngineeringNodeType;
  children?: EngineeringNodeItem[];
}

export const DUMMY_ENGINEERING_HIERARCHY: EngineeringNodeItem[] = [
  {
    id: 'org-bihar-wrd',
    name: 'Water Resources Department Bihar',
    type: 'ORGANIZATION',
    children: [
      {
        id: 'proj-kosi-flood-2026',
        name: 'Kosi Embankment Protection Project',
        type: 'PROJECT',
        children: [
          {
            id: 'asset-kosi-left-embankment',
            name: 'Kosi Left Flood Embankment',
            type: 'ASSET',
            children: [
              {
                id: 'region-birpur-sector-01',
                name: 'Birpur High Risk Sector',
                type: 'REGION',
                children: [
                  {
                    id: 'zone-dz-01-ch142',
                    name: 'Zone DZ-01 (CH 14.20km - 18.50km)',
                    type: 'DEPLOYMENT_ZONE',
                    children: [
                      { id: 'node-n-1420', name: 'Engineering Node N-1420', type: 'NODE' },
                      { id: 'node-n-1425', name: 'Engineering Node N-1425', type: 'NODE' },
                      { id: 'node-n-1430', name: 'Engineering Node N-1430', type: 'NODE' }
                    ]
                  },
                  {
                    id: 'zone-dz-02-ch185',
                    name: 'Zone DZ-02 (CH 18.50km - 22.00km)',
                    type: 'DEPLOYMENT_ZONE',
                    children: [
                      { id: 'node-n-1850', name: 'Engineering Node N-1850', type: 'NODE' },
                      { id: 'node-n-1855', name: 'Engineering Node N-1855', type: 'NODE' }
                    ]
                  }
                ]
              },
              {
                id: 'region-supaul-sector-02',
                name: 'Supaul Downstream Sector',
                type: 'REGION',
                children: [
                  {
                    id: 'zone-dz-03-ch220',
                    name: 'Zone DZ-03 (CH 22.00km - 26.40km)',
                    type: 'DEPLOYMENT_ZONE',
                    children: [
                      { id: 'node-n-2200', name: 'Engineering Node N-2200', type: 'NODE' },
                      { id: 'node-n-2210', name: 'Engineering Node N-2210', type: 'NODE' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'asset-gandak-right-embankment',
            name: 'Gandak Right Ring Bundh',
            type: 'ASSET',
            children: [
              {
                id: 'region-valmiki-sector-01',
                name: 'Valmikinagar Control Zone',
                type: 'REGION',
                children: [
                  {
                    id: 'zone-dz-04-ch020',
                    name: 'Zone DZ-04 (CH 0.20km - 4.50km)',
                    type: 'DEPLOYMENT_ZONE',
                    children: [
                      { id: 'node-n-0020', name: 'Engineering Node N-0020', type: 'NODE' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
