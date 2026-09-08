import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MockApiService } from '../core/mock-api.service';
import { AvatarComponent, ModalComponent, ProgressComponent, StatusComponent } from '../shared/ui';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent,
    ModalComponent,
    ProgressComponent,
    StatusComponent,
  ],
  templateUrl: './admin.html',
})
export class AdminComponent {
  readonly api = inject(MockApiService);
  private readonly routeData = toSignal(inject(ActivatedRoute).data, {
    initialValue: { page: 'overview' },
  });
  readonly page = computed(() => this.routeData()['page'] as string);
  readonly actionModal = signal<string | null>(null);
  readonly selectedServer = signal('cb-1');
  readonly selectedPlayer = signal('p-001');
  readonly selectedBackup = signal('');
  readonly moderationAction = signal('Warnung');
  readonly logLevel = signal<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  readonly consolePaused = signal(false);
  readonly settingsTab = signal('Netzwerk');
  readonly selectedRole = signal('Administrator');
  command = '';
  consoleSearch = '';
  playerSearch = '';
  auditSearch = '';
  serverChoice = 'CityBuild-1';
  actionReason = '';
  broadcastTarget = 'Gesamtes Netzwerk';
  broadcastMessage = '';
  networkName = 'Minedesso Network';
  serverAddress = 'play.minedesso.de';
  maxPlayers = 500;
  publicStatus = true;
  whitelist = ['Aloxio', 'LumaLeaf', 'NovaCraft', 'PixelMara'];
  readonly players = computed(() => [
    this.api.player(),
    ...this.api.friends(),
    {
      ...this.api.friends()[2],
      id: 'x1',
      name: 'Griefer_404',
      rank: 'SPIELER',
      online: false,
      lastSeen: 'Vor 5 Tagen',
      hue: '#a56c63',
    },
  ]);
  readonly filteredPlayers = computed(() =>
    this.players().filter(
      (player) =>
        player.name.toLowerCase().includes(this.playerSearch.toLowerCase()) ||
        player.uuid.includes(this.playerSearch),
    ),
  );
  readonly activePlayer = computed(
    () => this.players().find((player) => player.id === this.selectedPlayer()) ?? this.players()[0],
  );
  readonly activeServer = computed(
    () =>
      this.api.servers().find((server) => server.id === this.selectedServer()) ??
      this.api.servers()[0],
  );
  readonly selectedServerName = computed(() => this.serverChoice);
  readonly filteredLogs = computed(() =>
    this.api
      .consoleLines()
      .filter(
        (line) =>
          (this.logLevel() === 'ALL' || line.level === this.logLevel()) &&
          line.message.toLowerCase().includes(this.consoleSearch.toLowerCase()),
      ),
  );
  readonly filteredAudit = computed(() =>
    this.api
      .auditEntries()
      .filter((entry) =>
        `${entry.actor} ${entry.action} ${entry.target}`
          .toLowerCase()
          .includes(this.auditSearch.toLowerCase()),
      ),
  );
  readonly moderationActions = [
    'Kick',
    'Ban',
    'Tempban',
    'Unban',
    'Mute',
    'Tempmute',
    'Unmute',
    'Warnung',
  ];
  readonly roleList = [
    { name: 'Administrator', members: 3, permissions: 24, color: '#e1a953' },
    { name: 'Moderator', members: 8, permissions: 12, color: '#7aa8df' },
    { name: 'Developer', members: 4, permissions: 15, color: '#9b7ed8' },
    { name: 'Support', members: 12, permissions: 7, color: '#75c392' },
  ];
  readonly permissionGroups = [
    {
      name: 'Server',
      items: [
        { label: 'Server ansehen', description: 'Status und Telemetrie einsehen.', enabled: true },
        { label: 'Server neu starten', description: 'Restart-Aktionen auslösen.', enabled: true },
        {
          label: 'Whitelist verwalten',
          description: 'Spieler hinzufügen und entfernen.',
          enabled: true,
        },
      ],
    },
    {
      name: 'Konsole',
      items: [
        {
          label: 'Konsole ansehen',
          description: 'Live-Ausgabe aller Server lesen.',
          enabled: true,
        },
        { label: 'Commands ausführen', description: 'Befehle an Server senden.', enabled: true },
      ],
    },
    {
      name: 'Backups & Moderation',
      items: [
        {
          label: 'Backups erstellen',
          description: 'Manuelle Sicherungspunkte anlegen.',
          enabled: true,
        },
        {
          label: 'Backups wiederherstellen',
          description: 'Weltdaten aus Sicherung zurückspielen.',
          enabled: true,
        },
        {
          label: 'Spieler moderieren',
          description: 'Sanktionen und Notizen verwalten.',
          enabled: true,
        },
      ],
    },
  ];
  statusLabel(status: string): string {
    return (
      (
        {
          online: 'Online',
          offline: 'Offline',
          degraded: 'Eingeschränkt',
          maintenance: 'Wartung',
        } as Record<string, string>
      )[status] ?? status
    );
  }
  runCommand(): void {
    this.api.sendCommand(this.serverChoice, this.command);
    this.command = '';
  }
  confirmAction(action: string, target: string): void {
    this.api.audit(action, target);
    this.api.showToast(`${action}: ${target}`);
    this.actionModal.set(null);
    this.actionReason = '';
    this.broadcastMessage = '';
  }
  removeWhitelist(name: string): void {
    this.whitelist = this.whitelist.filter((item) => item !== name);
    this.api.showToast(`${name} von der Whitelist entfernt.`);
  }
  saveSettings(): void {
    this.api.audit('Einstellungen geändert', this.settingsTab());
    this.api.showToast('Konfiguration gespeichert und versioniert.');
  }
}
