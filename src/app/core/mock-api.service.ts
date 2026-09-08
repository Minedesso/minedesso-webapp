import { Injectable, computed, signal } from '@angular/core';
import { AuditEntry, Backup, Notification, Player, Quest, Reward, Server } from './models';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  readonly apiState = signal<'loading' | 'ready' | 'offline'>('ready');
  readonly apiVersion = 'mock-api v1.2.0';
  readonly isAuthenticated = signal(false);
  readonly isLinked = signal(false);
  readonly leaderboardOptIn = signal(false);
  readonly toast = signal<string | null>(null);
  readonly notificationsOpen = signal(false);

  readonly player = signal<Player>({
    id: 'p-001',
    uuid: 'b30f6f84-2d91-4ef0-baad-e21f5b070b72',
    name: 'Aloxio',
    rank: 'LEGEND',
    coins: 12840,
    level: 42,
    xp: 7340,
    xpTarget: 10000,
    joinedAt: '14. März 2023',
    playtime: '428 Std.',
    online: true,
    server: 'CityBuild-1',
    lastSeen: 'Jetzt online',
    hue: '#9bdd62',
    skinUrl: '/assets/player-skins.png',
    skinIndex: 0,
  });

  readonly servers = signal<Server[]>([
    {
      id: 'proxy-1',
      name: 'Proxy',
      type: 'Velocity',
      status: 'online',
      players: 247,
      capacity: 500,
      ram: 38,
      cpu: 19,
      tps: 20,
      mspt: 8,
      uptime: '18T 04h',
      version: 'Velocity 3.4.0',
    },
    {
      id: 'lobby-1',
      name: 'Lobby-1',
      type: 'Lobby',
      status: 'online',
      players: 68,
      capacity: 120,
      ram: 54,
      cpu: 31,
      tps: 20,
      mspt: 12,
      uptime: '12T 09h',
      version: 'Paper 1.21.8',
    },
    {
      id: 'cb-1',
      name: 'CityBuild-1',
      type: 'CityBuild',
      status: 'online',
      players: 112,
      capacity: 180,
      ram: 71,
      cpu: 46,
      tps: 19.9,
      mspt: 29,
      uptime: '6T 21h',
      version: 'Paper 1.21.8',
    },
    {
      id: 'iw-1',
      name: 'IsleWars-1',
      type: 'IsleWars',
      status: 'degraded',
      players: 51,
      capacity: 100,
      ram: 82,
      cpu: 67,
      tps: 18.7,
      mspt: 47,
      uptime: '3T 02h',
      version: 'Paper 1.21.8',
    },
    {
      id: 'event-1',
      name: 'Event-1',
      type: 'Event',
      status: 'maintenance',
      players: 0,
      capacity: 200,
      ram: 12,
      cpu: 4,
      tps: 20,
      mspt: 4,
      uptime: 'Offline',
      version: 'Paper 1.21.8',
    },
  ]);
  readonly onlinePlayers = computed(() =>
    this.servers()
      .filter((s) => s.id !== 'proxy-1')
      .reduce((sum, server) => sum + server.players, 0),
  );
  readonly networkRam = computed(() =>
    Math.round(this.servers().reduce((sum, server) => sum + server.ram, 0) / this.servers().length),
  );

  readonly friends = signal<Player[]>([
    {
      id: 'f1',
      uuid: '1',
      name: 'LumaLeaf',
      rank: 'VIP',
      coins: 3420,
      level: 31,
      xp: 6200,
      xpTarget: 8000,
      joinedAt: '',
      playtime: '260 Std.',
      online: true,
      server: 'CityBuild-1',
      lastSeen: 'Jetzt online',
      hue: '#f3b35b',
      skinUrl: '/assets/player-skins.png',
      skinIndex: 1,
    },
    {
      id: 'f2',
      uuid: '2',
      name: 'NovaCraft',
      rank: 'SPIELER',
      coins: 980,
      level: 18,
      xp: 2200,
      xpTarget: 5000,
      joinedAt: '',
      playtime: '92 Std.',
      online: true,
      server: 'IsleWars-1',
      lastSeen: 'Jetzt online',
      hue: '#7faee8',
      skinUrl: '/assets/player-skins.png',
      skinIndex: 2,
    },
    {
      id: 'f3',
      uuid: '3',
      name: 'BlockBarde',
      rank: 'VIP',
      coins: 8920,
      level: 39,
      xp: 4900,
      xpTarget: 9000,
      joinedAt: '',
      playtime: '355 Std.',
      online: false,
      lastSeen: 'Vor 2 Stunden',
      hue: '#c98be9',
      skinUrl: '/assets/player-skins.png',
      skinIndex: 3,
    },
    {
      id: 'f4',
      uuid: '4',
      name: 'PixelMara',
      rank: 'SPIELER',
      coins: 540,
      level: 12,
      xp: 800,
      xpTarget: 3000,
      joinedAt: '',
      playtime: '42 Std.',
      online: false,
      lastSeen: 'Gestern, 21:14',
      hue: '#eb8198',
      skinUrl: '/assets/player-skins.png',
      skinIndex: 4,
    },
  ]);

  readonly quests = signal<Quest[]>([
    {
      id: 'q1',
      title: 'Baumeister im Grünen',
      description: 'Platziere 500 Blöcke auf CityBuild.',
      type: 'Daily',
      progress: 320,
      target: 500,
      reward: '450 XP · 200 Coins',
      expires: '11:42 Std.',
      status: 'active',
    },
    {
      id: 'q2',
      title: 'Inselstürmer',
      description: 'Gewinne 3 Runden IsleWars.',
      type: 'Weekly',
      progress: 0,
      target: 3,
      reward: '1.200 XP · Insel-Badge',
      expires: '4 Tage',
      status: 'available',
    },
    {
      id: 'q3',
      title: 'Gemeinsam stark',
      description: 'Spiele 30 Minuten mit einem Freund.',
      type: 'Daily',
      progress: 30,
      target: 30,
      reward: '300 Coins',
      expires: '11:42 Std.',
      status: 'claimable',
    },
    {
      id: 'q4',
      title: 'Das Tor erwacht',
      description: 'Entdecke das Portal beim Chronik-Event.',
      type: 'Event',
      progress: 1,
      target: 1,
      reward: 'Portalpartikel',
      expires: '6 Tage',
      status: 'claimed',
    },
  ]);

  readonly rewards = signal<Reward[]>([
    {
      id: 'r1',
      name: 'Moos-Rahmen',
      category: 'Web',
      rarity: 'Selten',
      icon: '▣',
      unlocked: true,
      equipped: true,
      source: 'Chronik I · Kapitel 2',
    },
    {
      id: 'r2',
      name: 'Lore: Smaragd',
      category: 'Ingame',
      rarity: 'Episch',
      icon: '◆',
      unlocked: true,
      equipped: false,
      source: 'Achievement: Händler III',
    },
    {
      id: 'r3',
      name: '[PIONIER]',
      category: 'Chat',
      rarity: 'Legendär',
      icon: '✦',
      unlocked: true,
      equipped: false,
      source: 'Gründungs-Event',
    },
    {
      id: 'r4',
      name: 'Waldläufer',
      category: 'Badge',
      rarity: 'Selten',
      icon: '♜',
      unlocked: true,
      equipped: true,
      source: '100 Stunden Spielzeit',
    },
    {
      id: 'r5',
      name: 'Ender-Flügel',
      category: 'Ingame',
      rarity: 'Legendär',
      icon: '◇',
      unlocked: false,
      equipped: false,
      source: 'Chronik I · Finale',
    },
    {
      id: 'r6',
      name: 'Aurora-Banner',
      category: 'Web',
      rarity: 'Episch',
      icon: '▤',
      unlocked: false,
      equipped: false,
      source: 'Winterevent 2026',
    },
  ]);

  readonly notifications = signal<Notification[]>([
    {
      id: 'n1',
      title: 'Quest abgeschlossen',
      text: 'Gemeinsam stark wartet auf dich.',
      time: 'Vor 8 Min.',
      route: '/hub/quests',
      read: false,
      icon: '✓',
    },
    {
      id: 'n2',
      title: 'Chronik-Meilenstein',
      text: 'Du hast das Moortal erreicht.',
      time: 'Vor 2 Std.',
      route: '/hub/chronicles',
      read: false,
      icon: '⌁',
    },
    {
      id: 'n3',
      title: 'Freund online',
      text: 'LumaLeaf spielt jetzt CityBuild.',
      time: 'Vor 4 Std.',
      route: '/hub/friends',
      read: true,
      icon: '◉',
    },
  ]);
  readonly unreadCount = computed(
    () => this.notifications().filter((notification) => !notification.read).length,
  );

  readonly backups = signal<Backup[]>([
    {
      id: 'b1',
      server: 'CityBuild-1',
      createdAt: 'Heute, 03:00',
      size: '18,4 GB',
      type: 'Vollbackup',
      automatic: true,
      status: 'success',
    },
    {
      id: 'b2',
      server: 'IsleWars-1',
      createdAt: 'Heute, 02:30',
      size: '4,8 GB',
      type: 'Inkrementell',
      automatic: true,
      status: 'success',
    },
    {
      id: 'b3',
      server: 'Lobby-1',
      createdAt: 'Gestern, 23:18',
      size: '2,1 GB',
      type: 'Manuell',
      automatic: false,
      status: 'success',
    },
    {
      id: 'b4',
      server: 'CityBuild-1',
      createdAt: 'Gestern, 03:00',
      size: '—',
      type: 'Vollbackup',
      automatic: true,
      status: 'failed',
    },
  ]);

  readonly auditEntries = signal<AuditEntry[]>([
    {
      id: 'a1',
      actor: 'Aloxio',
      action: 'Broadcast gesendet',
      target: 'Netzwerk',
      time: 'Heute, 14:32:08',
      result: 'Erfolgreich',
    },
    {
      id: 'a2',
      actor: 'LumaDev',
      action: 'Backup erstellt',
      target: 'Lobby-1',
      time: 'Heute, 12:18:44',
      result: 'Erfolgreich',
    },
    {
      id: 'a3',
      actor: 'Aloxio',
      action: 'Spieler verwarnt',
      target: 'Griefer_404',
      time: 'Heute, 10:04:17',
      result: 'Erfolgreich',
    },
    {
      id: 'a4',
      actor: 'System',
      action: 'Backup erstellt',
      target: 'CityBuild-1',
      time: 'Heute, 03:00:01',
      result: 'Erfolgreich',
    },
  ]);

  readonly consoleLines = signal([
    { time: '14:32:04', level: 'INFO' as const, message: '[Server] Saving worlds...' },
    {
      time: '14:32:06',
      level: 'INFO' as const,
      message: '[Minedesso] Player LumaLeaf joined CityBuild-1',
    },
    {
      time: '14:32:11',
      level: 'WARN' as const,
      message: '[Performance] MSPT above threshold: 47ms',
    },
    {
      time: '14:32:18',
      level: 'INFO' as const,
      message: '[Quest] Progress updated for Aloxio (320/500)',
    },
    {
      time: '14:32:22',
      level: 'ERROR' as const,
      message: '[Backup] Snapshot retry scheduled in 30s',
    },
  ]);

  login(): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => {
        this.isAuthenticated.set(true);
        resolve();
      }, 650),
    );
  }
  logout(): void {
    this.isAuthenticated.set(false);
    this.isLinked.set(false);
  }
  linkAccount(): void {
    this.isLinked.set(true);
    this.showToast('Minecraft-Account erfolgreich verknüpft.');
  }
  startQuest(id: string): void {
    this.quests.update((items) => items.map((q) => (q.id === id ? { ...q, status: 'active' } : q)));
    this.showToast('Quest gestartet – Fortschritt zählt ab jetzt.');
  }
  claimQuest(id: string): void {
    this.quests.update((items) =>
      items.map((q) => (q.id === id ? { ...q, status: 'claimed' } : q)),
    );
    this.showToast('Belohnung deinem Inventar gutgeschrieben.');
  }
  equipReward(id: string): void {
    this.rewards.update((items) =>
      items.map((r) => (r.id === id ? { ...r, equipped: !r.equipped } : r)),
    );
    this.showToast('Ausrüstung aktualisiert.');
  }
  enableLeaderboard(): void {
    this.leaderboardOptIn.set(true);
    this.showToast('Dauerhafte Ranglisten-Teilnahme aktiviert.');
  }
  markNotificationsRead(): void {
    this.notifications.update((items) => items.map((n) => ({ ...n, read: true })));
  }
  joinFriend(friend: Player): void {
    this.showToast(`Join-Anfrage für ${friend.name} auf ${friend.server} gesendet.`);
  }
  addBackup(server: string): void {
    const backup: Backup = {
      id: crypto.randomUUID(),
      server,
      createdAt: 'Gerade eben',
      size: 'Wird berechnet',
      type: 'Manuell',
      automatic: false,
      status: 'running',
    };
    this.backups.update((items) => [backup, ...items]);
    this.audit('Backup gestartet', server);
    this.showToast(`Backup für ${server} wurde gestartet.`);
  }
  sendCommand(server: string, command: string): void {
    if (!command.trim()) return;
    this.consoleLines.update((lines) => [
      ...lines,
      {
        time: new Date().toLocaleTimeString('de-DE'),
        level: 'INFO',
        message: `> ${command.trim()} (${server})`,
      },
    ]);
    this.audit('Command ausgeführt', server);
    this.showToast('Command sicher übermittelt.');
  }
  audit(action: string, target: string): void {
    this.auditEntries.update((entries) => [
      {
        id: crypto.randomUUID(),
        actor: this.player().name,
        action,
        target,
        time: 'Gerade eben',
        result: 'Erfolgreich',
      },
      ...entries,
    ]);
  }
  showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 3200);
  }
}
