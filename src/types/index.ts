export type ProtocolType = 'MQTT' | 'MODBUS_TCP' | 'MODBUS_RTU';
export type DataType = 'INT16' | 'FLOAT32' | 'BOOLEAN' | 'STRING';
export type AccessType = 'READ' | 'READ_WRITE';
export type AlarmSeverity = 'CRITICAL_HH' | 'WARNING_H' | 'WARNING_L' | 'CRITICAL_LL' | 'NORMAL';
export type DeviceStatusFilter = 'ALL' | 'ONLINE' | 'ALARM' | 'OFFLINE' | 'DISABLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ENGINEER' | 'OPERATOR';
  tenantId: string;
  tenantName: string;
}

export interface MqttConfig {
  brokerUrl: string;
  topic: string;
  clientId: string;
  qos: 0 | 1 | 2;
}

export interface ModbusConfig {
  host: string;
  port: number;
  slaveId: number;
  pollingIntervalMs: number;
}

export interface Device {
  id: string;
  tenantId: string;
  systemId?: string;
  name: string;
  identifier: string; // MAC / Serial
  protocol: ProtocolType;
  protocolConfig: MqttConfig | ModbusConfig;
  isOnline: boolean;
  status: 'ONLINE' | 'ALARM' | 'OFFLINE' | 'DISABLED';
  lastSeenAt: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export interface Tag {
  id: string;
  deviceId: string;
  tenantId: string;
  name: string;
  address: string; // Modbus Register or JSONPath
  dataType: DataType;
  accessType: AccessType;
  scaleFactor: number;
  offset: number;
  unit: string;
  currentValue: number | string | boolean;
  alarmLL?: number;
  alarmL?: number;
  alarmH?: number;
  alarmHH?: number;
  retentionDays: number;
  lastUpdated: string;
}

export interface AlarmEvent {
  id: string;
  tenantId: string;
  deviceId: string;
  deviceName: string;
  tagId: string;
  tagName: string;
  severity: AlarmSeverity;
  triggerValue: number;
  setpointValue: number;
  message: string;
  timestamp: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface NotificationLog {
  id: string;
  alarmId: string;
  channel: 'TELEGRAM' | 'WHATSAPP' | 'EMAIL' | 'PUSH';
  recipient: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  timestamp: string;
  content: string;
}

export interface SystemNode {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  parentId?: string;
}

export interface AIReport {
  id: string;
  timestamp: string;
  prompt: string;
  content: string;
  summary: string;
  model: string;
}

export interface DatabaseTestLog {
  id: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  collection: string;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR';
  latencyMs: number;
  details: string;
}
