import { create } from 'zustand';
import { Device, Tag, AlarmEvent, NotificationLog, SystemNode, AIReport, User, DeviceStatusFilter, DatabaseTestLog } from '../types';

interface SupervisoryState {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Theme & Navigation
  theme: 'light' | 'dark';
  currentTenantId: string;
  tenantName: string;
  activeView: 'overview' | 'hierarchy' | 'devices' | 'tags' | 'synoptic' | 'alarms' | 'ai-reports' | 'db-test' | 'settings';
  subTab: 'dispositivos' | 'parametros' | 'alarmes' | 'tendencia' | 'notas';
  
  // Filtering & Search (Boss Mini Style)
  statusFilter: DeviceStatusFilter;
  searchQuery: string;
  
  // Data State
  systems: SystemNode[];
  devices: Device[];
  tags: Tag[];
  alarms: AlarmEvent[];
  notifications: NotificationLog[];
  aiReports: AIReport[];
  dbTestLogs: DatabaseTestLog[];
  
  // Settings & Simulation
  geminiApiKey: string;
  isSimulatingTelemetry: boolean;
  
  // Auth Actions
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string, tenantName: string) => boolean;
  logout: () => void;
  
  // View & Theme Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveView: (view: SupervisoryState['activeView']) => void;
  setSubTab: (tab: SupervisoryState['subTab']) => void;
  setStatusFilter: (filter: DeviceStatusFilter) => void;
  setSearchQuery: (query: string) => void;
  setGeminiApiKey: (key: string) => void;
  toggleSimulation: () => void;
  
  // Device & Tag CRUD
  addDevice: (device: Omit<Device, 'id' | 'lastSeenAt' | 'isOnline' | 'status'>) => void;
  deleteDevice: (id: string) => void;
  
  addTag: (tag: Omit<Tag, 'id' | 'currentValue' | 'lastUpdated'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  writeTagValue: (tagId: string, newValue: number | string | boolean) => void;
  acknowledgeAlarm: (alarmId: string, operatorName: string) => void;
  
  addAIReport: (report: Omit<AIReport, 'id'>) => void;
  addDbTestLog: (log: Omit<DatabaseTestLog, 'id'>) => void;
  updateTelemetryTick: () => void;
}

const INITIAL_USER: User = {
  id: 'usr-01',
  name: 'Operador Getware',
  email: 'operador@getware.cloud',
  role: 'ENGINEER',
  tenantId: 'tenant-01',
  tenantName: 'Getware IoT Indústria'
};

const INITIAL_SYSTEMS: SystemNode[] = [
  { id: 'sys-1', tenantId: 'tenant-01', name: 'Planta de Processamento Principal', description: 'Linha de fusão e conformação' },
  { id: 'sys-2', tenantId: 'tenant-01', name: 'Sistema de Refrigeração & Chiller', description: 'Circuito fechado de água gelada' }
];

const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev-01',
    tenantId: 'tenant-01',
    systemId: 'sys-1',
    name: 'Internal IO (Forno de Indução 01)',
    identifier: 'MODBUS-PLC-01',
    protocol: 'MODBUS_TCP',
    protocolConfig: { host: '192.168.1.100', port: 502, slaveId: 1, pollingIntervalMs: 1000 },
    isOnline: true,
    status: 'ONLINE',
    lastSeenAt: new Date().toISOString(),
    location: 'Galpão A - Setor 02',
    description: 'Controlador I/O Digital e Temperatura'
  },
  {
    id: 'dev-02',
    tenantId: 'tenant-01',
    systemId: 'sys-2',
    name: 'Sensor Multiparâmetro (Chiller)',
    identifier: 'GW-MQTT-SENSOR-01',
    protocol: 'MQTT',
    protocolConfig: { brokerUrl: 'mqtt://broker.getware.cloud:1883', topic: 'getware/tenant-01/chiller/telemetry', clientId: 'gw-chiller-01', qos: 1 },
    isOnline: true,
    status: 'ONLINE',
    lastSeenAt: new Date().toISOString(),
    location: 'Subestação Central',
    description: 'Sensor de Temperatura, Umidade e Vazão'
  },
  {
    id: 'dev-03',
    tenantId: 'tenant-01',
    systemId: 'sys-1',
    name: 'Compressor de Ar Comprimido 02',
    identifier: 'MODBUS-COMP-02',
    protocol: 'MODBUS_TCP',
    protocolConfig: { host: '192.168.1.105', port: 502, slaveId: 2, pollingIntervalMs: 1000 },
    isOnline: false,
    status: 'OFFLINE',
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    location: 'Casa de Compressores',
    description: 'Compressor reserva de alívio de pressão'
  }
];

const INITIAL_TAGS: Tag[] = [
  {
    id: 'tag-01',
    deviceId: 'dev-01',
    tenantId: 'tenant-01',
    name: 'Digital Output 1',
    address: '40001',
    dataType: 'FLOAT32',
    accessType: 'READ_WRITE',
    scaleFactor: 1.0,
    offset: 0,
    unit: '°C',
    currentValue: 29.9,
    alarmLL: 15,
    alarmL: 20,
    alarmH: 80,
    alarmHH: 95,
    retentionDays: 30,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tag-02',
    deviceId: 'dev-01',
    tenantId: 'tenant-01',
    name: 'Digital Output 2',
    address: '40002',
    dataType: 'BOOLEAN',
    accessType: 'READ_WRITE',
    scaleFactor: 1.0,
    offset: 0,
    unit: 'State',
    currentValue: true,
    retentionDays: 30,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tag-03',
    deviceId: 'dev-02',
    tenantId: 'tenant-01',
    name: 'Temperature °C/°F',
    address: '$.sensors.temp',
    dataType: 'FLOAT32',
    accessType: 'READ',
    scaleFactor: 1.0,
    offset: 0,
    unit: '°C',
    currentValue: 29.9,
    alarmLL: 10.0,
    alarmL: 18.0,
    alarmH: 35.0,
    alarmHH: 45.0,
    retentionDays: 30,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tag-04',
    deviceId: 'dev-02',
    tenantId: 'tenant-01',
    name: 'Relative % humidity',
    address: '$.sensors.humidity',
    dataType: 'FLOAT32',
    accessType: 'READ',
    scaleFactor: 1.0,
    offset: 0,
    unit: '%rH',
    currentValue: 38.0,
    retentionDays: 30,
    lastUpdated: new Date().toISOString()
  }
];

const INITIAL_ALARMS: AlarmEvent[] = [];

export const useSupervisoryStore = create<SupervisoryState>((set, get) => ({
  currentUser: INITIAL_USER,
  isAuthenticated: true,
  
  theme: 'light', // Light theme BOSS mini inspired by default
  currentTenantId: 'tenant-01',
  tenantName: 'Getware IoT Indústria',
  activeView: 'devices',
  subTab: 'dispositivos',
  
  statusFilter: 'ALL',
  searchQuery: '',
  
  systems: INITIAL_SYSTEMS,
  devices: INITIAL_DEVICES,
  tags: INITIAL_TAGS,
  alarms: INITIAL_ALARMS,
  notifications: [],
  aiReports: [],
  dbTestLogs: [
    {
      id: 'log-1',
      operation: 'READ',
      collection: 'devices',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      latencyMs: 42,
      details: 'Consulta a 3 dispositivos cadastrados no Firebase Firestore'
    }
  ],
  
  geminiApiKey: '',
  isSimulatingTelemetry: true,
  
  login: (email, pass) => {
    if (!email || !pass) return false;
    const user: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'ENGINEER',
      tenantId: 'tenant-01',
      tenantName: 'Getware IoT Cloud'
    };
    set({ currentUser: user, isAuthenticated: true });
    return true;
  },
  
  register: (name, email, pass, tenantName) => {
    if (!name || !email || !pass) return false;
    const user: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'ADMIN',
      tenantId: `tenant-${Date.now()}`,
      tenantName: tenantName || 'Minha Indústria Getware'
    };
    set({ currentUser: user, isAuthenticated: true, tenantName: user.tenantName });
    return true;
  },
  
  logout: () => set({ currentUser: null, isAuthenticated: false }),
  
  setTheme: (theme) => set({ theme }),
  setActiveView: (view) => set({ activeView: view }),
  setSubTab: (tab) => set({ subTab: tab }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setGeminiApiKey: (key) => set({ geminiApiKey: key }),
  toggleSimulation: () => set((s) => ({ isSimulatingTelemetry: !s.isSimulatingTelemetry })),
  
  addDevice: (deviceData) => {
    const newDevice: Device = {
      ...deviceData,
      id: `dev-${Date.now()}`,
      isOnline: true,
      status: 'ONLINE',
      lastSeenAt: new Date().toISOString()
    };
    set((s) => ({ devices: [...s.devices, newDevice] }));
  },
  
  deleteDevice: (id) => {
    set((s) => ({
      devices: s.devices.filter((d) => d.id !== id),
      tags: s.tags.filter((t) => t.deviceId !== id)
    }));
  },
  
  addTag: (tagData) => {
    const newTag: Tag = {
      ...tagData,
      id: `tag-${Date.now()}`,
      currentValue: tagData.dataType === 'BOOLEAN' ? false : 0,
      lastUpdated: new Date().toISOString()
    };
    set((s) => ({ tags: [...s.tags, newTag] }));
  },
  
  updateTag: (id, updates) => {
    set((s) => ({
      tags: s.tags.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }));
  },
  
  deleteTag: (id) => {
    set((s) => ({ tags: s.tags.filter((t) => t.id !== id) }));
  },
  
  writeTagValue: (tagId, newValue) => {
    set((s) => ({
      tags: s.tags.map((t) =>
        t.id === tagId
          ? { ...t, currentValue: newValue, lastUpdated: new Date().toISOString() }
          : t
      )
    }));
  },
  
  acknowledgeAlarm: (alarmId, operatorName) => {
    set((s) => ({
      alarms: s.alarms.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              isAcknowledged: true,
              acknowledgedBy: operatorName,
              acknowledgedAt: new Date().toISOString()
            }
          : a
      )
    }));
  },
  
  addAIReport: (report) => {
    set((s) => ({ aiReports: [{ ...report, id: `rep-${Date.now()}` }, ...s.aiReports] }));
  },
  
  addDbTestLog: (log) => {
    set((s) => ({ dbTestLogs: [{ ...log, id: `log-${Date.now()}` }, ...s.dbTestLogs] }));
  },
  
  updateTelemetryTick: () => {
    const { isSimulatingTelemetry, tags } = get();
    if (!isSimulatingTelemetry) return;
    
    const nowIso = new Date().toISOString();
    
    const updatedTags = tags.map((t) => {
      if (t.dataType === 'BOOLEAN') return t;
      const numVal = typeof t.currentValue === 'number' ? t.currentValue : parseFloat(t.currentValue as string) || 0;
      const delta = (Math.random() - 0.48) * (numVal * 0.005);
      const nextVal = Math.round((numVal + delta) * 10) / 10;
      
      return {
        ...t,
        currentValue: nextVal,
        lastUpdated: nowIso
      };
    });
    
    set({ tags: updatedTags });
  }
}));
