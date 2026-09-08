import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MockApiService } from '../core/mock-api.service';
import { AvatarComponent } from '../shared/ui';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AvatarComponent],
  templateUrl: './app-shell.html',
})
export class AppShellComponent {
  readonly api = inject(MockApiService);
  private readonly router = inject(Router);
  private readonly navigation = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ),
    { initialValue: new NavigationEnd(0, this.router.url, this.router.url) },
  );
  readonly drawerOpen = signal(false);
  readonly sidebarCollapsed = signal(false);
  readonly playerNav: NavItem[] = [
    { label: 'Übersicht', route: '/hub/overview', icon: '⌂' },
    { label: 'Profil', route: '/hub/profile', icon: '♙' },
    { label: 'Spielmodi', route: '/hub/game-modes', icon: '◈' },
    { label: 'Freunde', route: '/hub/friends', icon: '◎', badge: '2' },
    { label: 'Achievements', route: '/hub/achievements', icon: '◇' },
    { label: 'Quests', route: '/hub/quests', icon: '☷', badge: '1' },
    { label: 'Daily Rewards', route: '/hub/daily', icon: '✦' },
    { label: 'Rewards', route: '/hub/rewards', icon: '◆' },
    { label: 'Chroniken', route: '/hub/chronicles', icon: '⌁' },
    { label: 'Events', route: '/hub/events', icon: '◉' },
    { label: 'Ranglisten', route: '/hub/leaderboards', icon: '♜' },
  ];
  readonly adminNav: NavItem[] = [
    { label: 'Overview', route: '/admin/overview', icon: '▦' },
    { label: 'Server', route: '/admin/servers', icon: '▤' },
    { label: 'Spieler', route: '/admin/players', icon: '♟' },
    { label: 'Konsole', route: '/admin/console', icon: '⌘' },
    { label: 'Backups', route: '/admin/backups', icon: '⬡' },
  ];
  readonly managementNav: NavItem[] = [
    { label: 'Einstellungen', route: '/admin/settings', icon: '⚙' },
    { label: 'Rollen & Rechte', route: '/admin/roles', icon: '♜' },
    { label: 'Audit Logs', route: '/admin/logs', icon: '☷' },
  ];
  readonly pageTitle = computed(() => {
    this.navigation();
    const url = this.router.url.split('/').pop() ?? 'overview';
    return (
      (
        {
          overview: 'Übersicht',
          profile: 'Profil',
          'game-modes': 'Spielmodi',
          friends: 'Freunde',
          achievements: 'Achievements',
          quests: 'Quests',
          daily: 'Daily Rewards',
          rewards: 'Rewards',
          chronicles: 'Chroniken',
          events: 'Events',
          leaderboards: 'Ranglisten',
          servers: 'Server',
          players: 'Spieler',
          console: 'Konsole',
          backups: 'Backups',
          settings: 'Einstellungen',
          roles: 'Rollen & Rechte',
          logs: 'Audit Logs',
        } as Record<string, string>
      )[url] ?? 'Übersicht'
    );
  });
  readonly area = computed(() => {
    this.navigation();
    return this.router.url.startsWith('/admin')
      ? ['settings', 'roles', 'logs'].includes(this.router.url.split('/').pop() ?? '')
        ? 'Management'
        : 'Server'
      : 'Player Hub';
  });
  logout(): void {
    this.api.logout();
    this.router.navigateByUrl('/');
  }
}
