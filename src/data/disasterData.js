// PRALEYE Disaster Intelligence Data Store
// Curated demonstration and telemetry scenario dataset for Pune and regional Maharashtra

export const DEMO_METADATA = {
  mode: 'DEMO_SCENARIO',
  region: 'Pune Metropolitan Region, Maharashtra, India',
  scenarioName: 'Monsoon Cloudburst & River Basin Surge (48h Cumulative)',
  lastUpdated: new Date().toISOString(),
  telemetrySource: 'IMD Pune AWS + CWC Mula-Mutha Sensor Network (Simulated Real-Time Feed)',
  modelEngine: 'PRALEYE XGBoost-GeoHydrology Ensemble v2.4',
};

export const DISASTER_INCIDENTS = [
  {
    id: 'INC-2024-001',
    name: 'Mula-Mutha River Basin Flash Inundation',
    type: 'Flood',
    severity: 'Critical',
    location: 'Hadapsar — Shivajinagar Riverine Corridor, Pune',
    coordinates: [18.5080, 73.9250],
    radiusKm: 4.2,
    floodProb: 87,
    rainfall24h: '142 mm',
    affectedAreaKm2: 18.4,
    populationAtRisk: 30800,
    highVulnerabilityPop: 8200,
    criticalFacilities: {
      hospitals: 3,
      schools: 11,
      bridges: 4,
      roadSegments: 26,
      shelters: 12
    },
    status: 'ACTIVE_RESPONSE',
    detectedAt: '12 Aug 2024, 11:45 IST',
    summary: 'Cloudburst over western catchment compounded by 18,000 cusecs controlled discharge from Khadakwasla Dam. Low-lying arterial roads inundated with water depth exceeding 1.2m.',
    recommendedActions: [
      'Issue immediate Zone-A evacuation order for Hadapsar lowlands',
      'Barricade Holkar Bridge and Sangam Bridge approaches',
      'Pre-position 3 NDRF Zodiac boats at Kharadi riverfront',
      'Divert inbound traffic along South Ring bypass'
    ],
    polygon: [
      [18.5080, 73.9250], [18.5150, 73.9350], [18.5100, 73.9450],
      [18.5000, 73.9400], [18.4950, 73.9300], [18.5020, 73.9220]
    ]
  },
  {
    id: 'INC-2024-002',
    name: 'Kharadi IT Corridor Storm Drain Overflow',
    type: 'Flood',
    severity: 'High',
    location: 'Kharadi Bypass & EON Free Zone, Pune',
    coordinates: [18.5550, 73.9300],
    radiusKm: 2.8,
    floodProb: 72,
    rainfall24h: '118 mm',
    affectedAreaKm2: 9.6,
    populationAtRisk: 14200,
    highVulnerabilityPop: 3100,
    criticalFacilities: {
      hospitals: 1,
      schools: 4,
      bridges: 2,
      roadSegments: 14,
      shelters: 5
    },
    status: 'ACTIVE_RESPONSE',
    detectedAt: '12 Aug 2024, 12:20 IST',
    summary: 'Secondary stormwater canal choked by debris, leading to water accumulation along tech park feeder arteries.',
    recommendedActions: [
      'Deploy 4 high-capacity mobile dewatering pumps',
      'Instruct IT commercial establishments to activate work-from-home protocols',
      'Route ambulances via Mundhwa elevated flyover'
    ],
    polygon: [
      [18.5550, 73.9300], [18.5620, 73.9400], [18.5580, 73.9520],
      [18.5480, 73.9480], [18.5450, 73.9350]
    ]
  },
  {
    id: 'INC-2024-003',
    name: 'Tamhini Ghat Slope Failure & Landslide',
    type: 'Landslide',
    severity: 'Critical',
    location: 'Tamhini Ghat — Mulshi Mountain Pass, Western Ghats',
    coordinates: [18.4680, 73.4350],
    radiusKm: 3.5,
    floodProb: 91, // Geotechnical failure index
    rainfall24h: '286 mm',
    affectedAreaKm2: 14.1,
    populationAtRisk: 4800,
    highVulnerabilityPop: 1200,
    criticalFacilities: {
      hospitals: 0,
      schools: 2,
      bridges: 3,
      roadSegments: 18,
      shelters: 2
    },
    status: 'CRITICAL_BLOCKAGE',
    detectedAt: '12 Aug 2024, 09:15 IST',
    summary: 'Major debris flow over State Highway 60. Mud and boulder mass of approx 4,500 m³ blocking both transit corridors.',
    recommendedActions: [
      'Close SH-60 entry checkpoints at Paud and Mangaon',
      'Dispatch heavy JCB earthmovers and civil defense NDRF team',
      'Air-drop satellite emergency communication transceivers'
    ],
    polygon: [
      [18.4750, 73.4280], [18.4820, 73.4420], [18.4650, 73.4510],
      [18.4550, 73.4360], [18.4620, 73.4250]
    ]
  },
  {
    id: 'INC-2024-004',
    name: 'Konkan Coastal Cyclone Surge Advisory',
    type: 'Cyclone',
    severity: 'High',
    location: 'Alibaug — Raigad Coastline, Maharashtra',
    coordinates: [18.6410, 72.8720],
    radiusKm: 18.0,
    floodProb: 76,
    rainfall24h: '165 mm',
    affectedAreaKm2: 42.0,
    populationAtRisk: 28500,
    highVulnerabilityPop: 9400,
    criticalFacilities: {
      hospitals: 4,
      schools: 16,
      bridges: 6,
      roadSegments: 32,
      shelters: 18
    },
    status: 'WATCH_WARNING',
    detectedAt: '12 Aug 2024, 08:00 IST',
    summary: 'Deep Arabian Sea depression tracking northeast at 18 km/h. Wind gusts up to 85 km/h with 2.8m tidal storm surge expected at high tide.',
    recommendedActions: [
      'Enforce complete fishing boat mooring ban along Raigad coast',
      'Mobilize coastal cyclone shelters in Revdanda and Kihim',
      'Stand by emergency diesel generators for taluka hospital'
    ],
    polygon: [
      [18.6800, 72.8400], [18.6950, 72.9100], [18.6100, 72.9200],
      [18.5900, 72.8600], [18.6300, 72.8300]
    ]
  },
  {
    id: 'INC-2024-005',
    name: 'Koyna Reservoir Seismic Tremor (M4.3)',
    type: 'Earthquake',
    severity: 'Moderate',
    location: 'Koyna Hydroelectric Dam Zone, Satara',
    coordinates: [17.4020, 73.7490],
    radiusKm: 12.0,
    floodProb: 44, // Structural vulnerability score
    rainfall24h: '45 mm',
    affectedAreaKm2: 24.5,
    populationAtRisk: 6200,
    highVulnerabilityPop: 850,
    criticalFacilities: {
      hospitals: 1,
      schools: 5,
      bridges: 2,
      roadSegments: 8,
      shelters: 4
    },
    status: 'MONITORING',
    detectedAt: '12 Aug 2024, 06:34 IST',
    summary: 'Reservoir-triggered seismic event recorded at focal depth 8.5 km. Accelerometers show peak ground acceleration within tolerance; structural inspection underway.',
    recommendedActions: [
      'Execute Phase-1 ultrasonic dam masonry inspection',
      'Inspect penstock pipes and spillway gates',
      'Maintain telemetry link with National Seismological Centre'
    ],
    polygon: [
      [17.4200, 73.7300], [17.4250, 73.7700], [17.3850, 73.7650],
      [17.3800, 73.7250]
    ]
  },
  {
    id: 'INC-2024-006',
    name: 'Sinhagad Forest Ridge Brushfire',
    type: 'Wildfire',
    severity: 'Moderate',
    location: 'Sinhagad Fort Protected Ridge, Pune South',
    coordinates: [18.3660, 73.7550],
    radiusKm: 2.1,
    floodProb: 38,
    rainfall24h: '0 mm',
    affectedAreaKm2: 3.8,
    populationAtRisk: 1400,
    highVulnerabilityPop: 220,
    criticalFacilities: {
      hospitals: 0,
      schools: 1,
      bridges: 0,
      roadSegments: 4,
      shelters: 1
    },
    status: 'CONTAINMENT',
    detectedAt: '11 Aug 2024, 21:10 IST',
    summary: 'Dry lightning ignited scrub vegetation along eastern ridge. Fire spread index elevated due to 32 km/h ridgeline wind gusts.',
    recommendedActions: [
      'Create 20m firebreak trench along fort tourist trail',
      'Deploy forest department beat officers with fire beaters',
      'Pre-position 2 water tankers at base village Golewadi'
    ],
    polygon: [
      [18.3720, 73.7480], [18.3780, 73.7620], [18.3580, 73.7640],
      [18.3550, 73.7500]
    ]
  }
];

export const CRITICAL_FACILITIES = [
  { id: 'FAC-01', name: 'Sassoon General Hospital', type: 'Hospital', coordinates: [18.5255, 73.8690], status: 'Critical', beds: 1250, patients: 840, icuBeds: 64, generatorBackup: true, contact: '+91 20 2612 8000' },
  { id: 'FAC-02', name: 'Noble Hospital Hadapsar', type: 'Hospital', coordinates: [18.5070, 73.9310], status: 'High', beds: 350, patients: 220, icuBeds: 28, generatorBackup: true, contact: '+91 20 6628 5000' },
  { id: 'FAC-03', name: 'Ruby Hall Clinic Pune', type: 'Hospital', coordinates: [18.5330, 73.8770], status: 'Moderate', beds: 600, patients: 450, icuBeds: 42, generatorBackup: true, contact: '+91 20 6645 5100' },
  { id: 'FAC-04', name: 'Sahyadri Super Speciality', type: 'Hospital', coordinates: [18.5080, 73.8340], status: 'Safe', beds: 200, patients: 110, icuBeds: 18, generatorBackup: true, contact: '+91 20 6721 3000' },
  { id: 'FAC-05', name: 'Aundh Civil Emergency Shelter', type: 'Shelter', coordinates: [18.5580, 73.8060], status: 'Safe', capacity: 1200, currentOccupants: 340, waterKits: 800, foodPackets: 2500, medicalStaff: 8 },
  { id: 'FAC-06', name: 'Kothrud Community Disaster Shelter', type: 'Shelter', coordinates: [18.4980, 73.8150], status: 'Safe', capacity: 850, currentOccupants: 190, waterKits: 600, foodPackets: 1800, medicalStaff: 5 },
  { id: 'FAC-07', name: 'Baner Stadium Relief Center', type: 'Shelter', coordinates: [18.5620, 73.7790], status: 'Safe', capacity: 2500, currentOccupants: 410, waterKits: 1500, foodPackets: 4500, medicalStaff: 14 },
  { id: 'FAC-08', name: 'Hadapsar Municipal School 4', type: 'School', coordinates: [18.5020, 73.9290], status: 'Critical', students: 640, evacuated: true, structureSafe: false },
  { id: 'FAC-09', name: 'Orchid International Kharadi', type: 'School', coordinates: [18.5520, 73.9370], status: 'High', students: 920, evacuated: true, structureSafe: true },
  { id: 'FAC-10', name: 'Holkar Bridge (Mula River)', type: 'Bridge', coordinates: [18.5505, 73.8640], status: 'Critical', clearanceMeters: 0.4, statusText: 'CLOSED TO VEHICLES — STRUCTURAL WATER PRESSURE' },
  { id: 'FAC-11', name: 'Hadapsar Flyover Junction', type: 'Bridge', coordinates: [18.5060, 73.9340], status: 'High', clearanceMeters: 2.1, statusText: 'HEAVY RESCUE TRAFFIC ONLY' },
  { id: 'FAC-12', name: 'Kharadi Cable Bridge', type: 'Bridge', coordinates: [18.5480, 73.9430], status: 'Moderate', clearanceMeters: 3.8, statusText: 'OPEN WITH 30 KM/H SPEED LIMIT' }
];

export const RESPONSE_RESOURCES = [
  { id: 'RES-01', name: 'NDRF Quick Response Teams', category: 'Personnel', total: 8, deployed: 6, reserved: 2, icon: 'Users', unit: 'Battalions (35 personnel each)' },
  { id: 'RES-02', name: 'Advanced Life Support Ambulances', category: 'Vehicles', total: 16, deployed: 11, reserved: 5, icon: 'Ambulance', unit: 'Paramedic Units' },
  { id: 'RES-03', name: 'Zodiac Inflatable Rescue Boats', category: 'Watercraft', total: 10, deployed: 7, reserved: 3, icon: 'Ship', unit: 'Outboard Motor Boats' },
  { id: 'RES-04', name: 'Heavy Industrial Dewatering Pumps', category: 'Equipment', total: 14, deployed: 9, reserved: 5, icon: 'Wrench', unit: '3500 GPM Diesel Pumps' },
  { id: 'RES-05', name: 'Disaster Trauma Medical Kits', category: 'Supplies', total: 450, deployed: 310, reserved: 140, icon: 'HeartPulse', unit: 'Standard Emergency Kits' },
  { id: 'RES-06', name: 'Emergency Satellite Radio Hubs', category: 'Comms', total: 12, deployed: 8, reserved: 4, icon: 'Radio', unit: 'ISRO Telemetry Transceivers' }
];

export const ACTIVE_ALERTS = [
  {
    id: 'ALT-101',
    severity: 'CRITICAL',
    title: 'Flash Flood Threat — Hadapsar Sector 4',
    timestamp: 'Just now (12:44 IST)',
    area: 'Pune Urban / Zone A',
    source: 'PRALEYE Flood Engine + CWC Gauge #14',
    message: 'Water levels at Hadapsar causeway reached 1.4m. Mandatory evacuation advisory triggered for 4,200 riverside homes.',
    acknowledged: false,
    capStatus: 'BROADCAST_SENT'
  },
  {
    id: 'ALT-102',
    severity: 'CRITICAL',
    title: 'Structural Overtopping — Holkar Bridge',
    timestamp: '14 min ago',
    area: 'Shivajinagar / Mula River',
    source: 'Pune Municipal Smart Sensor #08',
    message: 'Hydraulic scour sensors detected abnormal resonance. Bridge closed to all civilian vehicular movement.',
    acknowledged: false,
    capStatus: 'BROADCAST_SENT'
  },
  {
    id: 'ALT-103',
    severity: 'WARNING',
    title: 'High Precipitation Cloudburst Alert',
    timestamp: '32 min ago',
    area: 'Kharadi & Wagholi Catchment',
    source: 'IMD Doppler Radar Pashan',
    message: 'Precipitation rate of 34 mm/hr sustained over last 90 minutes. Secondary storm drains at 92% capacity.',
    acknowledged: true,
    capStatus: 'ACKNOWLEDGED'
  },
  {
    id: 'ALT-104',
    severity: 'WARNING',
    title: 'Dam Sluice Discharge Escalation',
    timestamp: '1h 10m ago',
    area: 'Khadakwasla Downstream Channel',
    source: 'Maharashtra Irrigation Dept',
    message: 'Discharge increased from 12,000 to 18,500 cusecs. Riverbank settlements alerted via civil sirens.',
    acknowledged: true,
    capStatus: 'ACKNOWLEDGED'
  },
  {
    id: 'ALT-105',
    severity: 'ADVISORY',
    title: 'Ghat Landslide Pre-Warning — Tamhini Pass',
    timestamp: '2h 15m ago',
    area: 'Raigad-Pune Border',
    source: 'Geological Survey of India Slope Telemetry',
    message: 'Pore pressure sensors indicate slope instability. Non-essential freight travel restricted on SH-60.',
    acknowledged: true,
    capStatus: 'INFO_LOGGED'
  }
];

export const EVACUATION_SCENARIOS = [
  {
    id: 'EVAC-01',
    from: 'Hadapsar Inundation Zone (Zone A)',
    to: 'Aundh Civil Emergency Shelter (Elevated Sector)',
    directRoute: {
      name: 'Direct Route A (City Central Corridor)',
      distanceKm: 3.4,
      estTimeMin: 8,
      riskLevel: 'REJECTED — CRITICAL HAZARD',
      status: 'BLOCKED',
      rejectionReason: 'Intersects Hadapsar Mutha River flood zone at Km 1.2. Water depth exceeds 1.4m; Holkar Bridge approach impassable.',
      color: '#ef4444',
      waypoints: [
        [18.5089, 73.9259],
        [18.5140, 73.8920],
        [18.5204, 73.8567], // Inundated city center
        [18.5390, 73.8290],
        [18.5580, 73.8060]
      ]
    },
    safeRoute: {
      name: 'PRALEYE Optimized Safe Route B (South Elevated Bypass)',
      distanceKm: 6.1,
      estTimeMin: 15,
      riskLevel: 'RECOMMENDED — 100% CLEAR',
      status: 'OPTIMAL',
      avoidances: ['Hadapsar Mutha Basin (Depth > 1.2m)', 'Holkar Structural Hazard', 'Sangamwadi Low Culvert'],
      clearanceMargin: 'Elevation +14m above 50-year flood line',
      color: '#10b981',
      waypoints: [
        [18.5089, 73.9259],
        [18.4890, 73.9010],
        [18.4720, 73.8610], // South Ring Road Bypass
        [18.4810, 73.8210],
        [18.5180, 73.7990],
        [18.5580, 73.8060]
      ]
    }
  },
  {
    id: 'EVAC-02',
    from: 'Kharadi Tech Zone (Zone B)',
    to: 'Baner Stadium Relief Center',
    directRoute: {
      name: 'Direct Route A (Nagar Road - Sangam Bridge)',
      distanceKm: 4.8,
      estTimeMin: 12,
      riskLevel: 'REJECTED — SEVERE WATERLOGGING',
      status: 'BLOCKED',
      rejectionReason: 'Submerged underpass at Yerawada (depth 0.9m). Heavy debris jamming.',
      color: '#ef4444',
      waypoints: [
        [18.5550, 73.9300],
        [18.5490, 73.8910],
        [18.5420, 73.8400],
        [18.5620, 73.7790]
      ]
    },
    safeRoute: {
      name: 'PRALEYE Optimized Safe Route B (North Elevated Ridge)',
      distanceKm: 7.4,
      estTimeMin: 17,
      riskLevel: 'RECOMMENDED — CLEAR',
      status: 'OPTIMAL',
      avoidances: ['Yerawada Submerged Underpass', 'Bund Garden Causeway'],
      clearanceMargin: 'High-elevation expressway corridor',
      color: '#10b981',
      waypoints: [
        [18.5550, 73.9300],
        [18.5820, 73.9100],
        [18.5910, 73.8500],
        [18.5800, 73.8050],
        [18.5620, 73.7790]
      ]
    }
  }
];
