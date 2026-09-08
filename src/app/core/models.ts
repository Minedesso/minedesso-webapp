export type Status = 'online' | 'offline' | 'maintenance' | 'degraded';
export type Severity = 'INFO' | 'WARN' | 'ERROR';

export interface Player {
  id: string;
  uuid: string;
  name: string;
  rank: string;
  coins: number;
  level: number;
  xp: number;
  xpTarget: number;
  joinedAt: string;
  playtime: string;
  online: boolean;
  server?: string;
  lastSeen: string;
  hue: string;
  skinUrl: string;
  skinIndex: number;
}

export interface Server {
  id: string;
  name: string;
  type: string;
  status: Status;
  players: number;
  capacity: number;
  ram: number;
  cpu: number;
  tps: number;
  mspt: number;
  uptime: string;
  version: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'Daily' | 'Weekly' | 'Event';
  progress: number;
  target: number;
  reward: string;
  expires: string;
  status: 'available' | 'active' | 'claimable' | 'claimed';
}

export interface Reward {
  id: string;
  name: string;
  category: 'Web' | 'Ingame' | 'Chat' | 'Badge';
  rarity: 'Gewöhnlich' | 'Selten' | 'Episch' | 'Legendär';
  icon: string;
  unlocked: boolean;
  equipped: boolean;
  source: string;
}

export interface Notification {
  id: string;
  title: string;
  text: string;
  time: string;
  route: string;
  read: boolean;
  icon: string;
}

export interface Backup {
  id: string;
  server: string;
  createdAt: string;
  size: string;
  type: string;
  automatic: boolean;
  status: 'success' | 'running' | 'failed';
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  result: 'Erfolgreich' | 'Fehlgeschlagen';
}
