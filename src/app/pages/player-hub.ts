import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockApiService } from '../core/mock-api.service';
import { AvatarComponent, ModalComponent, ProgressComponent, StatusComponent } from '../shared/ui';

@Component({
  selector: 'app-player-hub',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AvatarComponent,
    ProgressComponent,
    StatusComponent,
    ModalComponent,
  ],
  templateUrl: './player-hub.html',
})
export class PlayerHubComponent {
  readonly api = inject(MockApiService);
  private readonly routeData = toSignal(inject(ActivatedRoute).data, {
    initialValue: { page: 'overview' },
  });
  readonly page = computed(() => this.routeData()['page'] as string);
  readonly dailyClaimed = signal(false);
  readonly selectedMode = signal('citybuild');
  readonly friendModal = signal(false);
  readonly friendFilter = signal<'all' | 'online' | 'offline'>('all');
  readonly achievementCategory = signal('Netzwerk');
  readonly selectedAchievement = signal(2);
  readonly questFilter = signal('Alle');
  readonly rewardFilter = signal('Alle');
  readonly confirmOptIn = signal(false);
  friendSearch = '';
  optInConfirmed = false;

  readonly modes = [
    {
      id: 'citybuild',
      name: 'CityBuild',
      subtitle: 'Baue deine Geschichte',
      icon: '▦',
      level: 38,
      xp: 7420,
      target: 9000,
      next: 40,
      title: 'Meisterbauer',
      reward: 'Architekten-Rahmen',
      stats: [
        { icon: '▦', value: '184.2K', label: 'Blöcke platziert' },
        { icon: '◈', value: '32.4K', label: 'Coins verdient' },
        { icon: '⌂', value: '4', label: 'Plots' },
        { icon: '◷', value: '286h', label: 'Spielzeit' },
      ],
      milestones: [
        { level: 30, icon: '✓', name: 'Handwerker', reward: '+500 Coins' },
        { level: 35, icon: '◆', name: 'Baumeister', reward: 'Badge' },
        { level: 38, icon: '▦', name: 'Meisterbauer', reward: 'Aktuell' },
        { level: 40, icon: '♜', name: 'Architekt', reward: 'Profilrahmen' },
        { level: 50, icon: '✦', name: 'Legende', reward: 'Geheimer Reward' },
      ],
    },
    {
      id: 'islewars',
      name: 'IsleWars',
      subtitle: 'Erobere die Inseln',
      icon: '⚔',
      level: 27,
      xp: 3880,
      target: 6000,
      next: 30,
      title: 'Inselstratege',
      reward: 'Eroberer-Prefix',
      stats: [
        { icon: '♜', value: '86', label: 'Siege' },
        { icon: '⚔', value: '1.248', label: 'Kills' },
        { icon: '◇', value: '2,31', label: 'K/D' },
        { icon: '◉', value: '204', label: 'Runden' },
      ],
      milestones: [
        { level: 10, icon: '✓', name: 'Rekrut', reward: '+200 Coins' },
        { level: 20, icon: '◆', name: 'Kämpfer', reward: 'Badge' },
        { level: 27, icon: '⚔', name: 'Stratege', reward: 'Aktuell' },
        { level: 30, icon: '♜', name: 'Eroberer', reward: 'Chat-Prefix' },
        { level: 40, icon: '✦', name: 'Kriegsherr', reward: 'Item-Skin' },
      ],
    },
    {
      id: 'coming',
      name: 'Demnächst',
      subtitle: 'Eine neue Welt',
      icon: '?',
      level: 0,
      xp: 0,
      target: 1,
      next: 1,
      title: 'Noch verschlossen',
      reward: 'Unbekannt',
      stats: [{ icon: '?', value: '—', label: 'In Entwicklung' }],
      milestones: [{ level: 1, icon: '?', name: 'Bald verfügbar', reward: 'Geheim' }],
    },
  ];
  readonly activeMode = computed(
    () => this.modes.find((mode) => mode.id === this.selectedMode()) ?? this.modes[0],
  );
  readonly filteredFriends = computed(() =>
    this.api
      .friends()
      .filter(
        (friend) =>
          (this.friendFilter() === 'all' || (this.friendFilter() === 'online') === friend.online) &&
          friend.name.toLowerCase().includes(this.friendSearch.toLowerCase()),
      ),
  );
  readonly filteredQuests = computed(() =>
    this.api
      .quests()
      .filter((quest) => this.questFilter() === 'Alle' || quest.type === this.questFilter()),
  );
  readonly filteredRewards = computed(() =>
    this.api
      .rewards()
      .filter(
        (reward) => this.rewardFilter() === 'Alle' || reward.category === this.rewardFilter(),
      ),
  );
  readonly achievementNodes = [
    {
      title: 'Erste Schritte',
      description: 'Betritt das Minedesso Netzwerk.',
      icon: '⌂',
      state: 'done',
      progress: 1,
      target: 1,
      reward: '+100 XP',
      row: 1,
      col: 1,
    },
    {
      title: 'Weltenbummler',
      description: 'Besuche jeden verfügbaren Spielmodus.',
      icon: '⌁',
      state: 'done',
      progress: 3,
      target: 3,
      reward: '+250 Coins',
      row: 2,
      col: 2,
    },
    {
      title: 'Veteran',
      description: 'Erreiche Netzwerk-Level 45.',
      icon: '♜',
      state: 'active',
      progress: 42,
      target: 45,
      reward: 'Veteran-Badge · 1.000 XP',
      row: 3,
      col: 3,
    },
    {
      title: 'Legende',
      description: 'Erreiche Netzwerk-Level 60.',
      icon: '✦',
      state: 'locked',
      progress: 42,
      target: 60,
      reward: 'Legendärer Profilrahmen',
      row: 4,
      col: 4,
    },
    {
      title: 'Geheimer Pfad',
      description: 'Dieses Achievement muss erst entdeckt werden.',
      icon: '?',
      state: 'locked',
      progress: 0,
      target: 1,
      reward: '???',
      row: 2,
      col: 4,
    },
  ];
  readonly dailyRewards = [
    { day: 1, icon: '◈', value: '100', label: 'Coins' },
    { day: 2, icon: '✦', value: '200', label: 'XP' },
    { day: 3, icon: '◈', value: '175', label: 'Coins' },
    { day: 4, icon: '◆', value: '1×', label: 'Key' },
    { day: 5, icon: '✦', value: '500', label: 'XP' },
    { day: 6, icon: '◈', value: '250', label: 'Coins' },
    { day: 7, icon: '◆', value: 'Groß', label: 'Wochenkiste' },
  ];
  readonly regions = [
    {
      name: 'Das sanfte Grün',
      subtitle: 'Der Weg beginnt',
      icon: '⌂',
      nodes: [1, 2, 3, 4, 5, 6],
      done: 6,
      current: false,
      locked: false,
    },
    {
      name: 'Flüsterwald',
      subtitle: 'Zwischen alten Bäumen',
      icon: '♣',
      nodes: [1, 2, 3, 4, 5, 6, 7],
      done: 7,
      current: false,
      locked: false,
    },
    {
      name: 'Das Moortal',
      subtitle: 'Die Runen erwachen',
      icon: '◇',
      nodes: [1, 2, 3, 4, 5, 6],
      done: 3,
      current: true,
      locked: false,
    },
    {
      name: 'Eisenzahn',
      subtitle: 'Über den Wolken',
      icon: '▲',
      nodes: [1, 2, 3, 4, 5, 6],
      done: 0,
      current: false,
      locked: true,
    },
    {
      name: 'Tiefen der Leere',
      subtitle: 'Das letzte Tor',
      icon: '✦',
      nodes: [1, 2, 3, 4, 5],
      done: 0,
      current: false,
      locked: true,
    },
  ];
  readonly upcomingEvents = [
    {
      title: 'Erntefest',
      days: 12,
      text: 'Gemeinsames Bauen, Marktstände und besondere CityBuild-Quests.',
      reward: 'Goldene Sichel',
      icon: '♣',
      color: '#d69a45',
    },
    {
      title: 'IsleWars Cup',
      days: 24,
      text: 'Das große Turnier für Teams und Einzelkämpfer.',
      reward: 'Champion-Badge',
      icon: '⚔',
      color: '#6497da',
    },
    {
      title: 'Nacht der Schatten',
      days: 49,
      text: 'Ein saisonales Abenteuer in einer völlig neuen Event-Map.',
      reward: 'Schatten-Partikel',
      icon: '◉',
      color: '#9b6cc4',
    },
  ];
  readonly leaders = [
    { rank: 1, name: 'ElderFox', level: 68, hue: '#e5ad59', rankName: 'LEGEND' },
    { rank: 2, name: 'LumaLeaf', level: 63, hue: '#89c661', rankName: 'VIP' },
    { rank: 3, name: 'NovaCraft', level: 58, hue: '#6e99de', rankName: 'SPIELER' },
    { rank: 4, name: 'Stoneweaver', level: 51, hue: '#b38ada', rankName: 'VIP' },
    { rank: 5, name: 'Aloxio', level: 42, hue: '#9bdd62', rankName: 'LEGEND' },
    { rank: 6, name: 'PixelMara', level: 41, hue: '#e77fa0', rankName: 'SPIELER' },
    { rank: 7, name: 'BlockBarde', level: 39, hue: '#c98be9', rankName: 'VIP' },
  ];

  claimDaily(): void {
    if (!this.dailyClaimed()) {
      this.dailyClaimed.set(true);
      this.api.showToast('350 Coins, 800 XP und 1 Mystery Item erhalten!');
    }
  }
  enableLeaderboard(): void {
    this.api.enableLeaderboard();
    this.confirmOptIn.set(false);
  }
}
