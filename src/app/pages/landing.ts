import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockApiService } from '../core/mock-api.service';
import { AvatarComponent, ProgressComponent, StatusComponent } from '../shared/ui';

interface ShowcaseFeature {
  id: 'friends' | 'rewards' | 'chronicle' | 'achievements';
  index: string;
  eyebrow: string;
  title: string;
  text: string;
}

interface WallPiece {
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

interface JourneyStep {
  number: string;
  icon: string;
  title: string;
  text: string;
  detail: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, AvatarComponent, ProgressComponent, StatusComponent],
  templateUrl: './landing.html',
})
export class LandingComponent implements AfterViewInit {
  readonly api = inject(MockApiService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('wallSequence') private wallSequence?: ElementRef<HTMLElement>;
  @ViewChildren('storyBeat') private storyBeats?: QueryList<ElementRef<HTMLElement>>;

  readonly copied = signal(false);
  readonly activeFeature = signal<ShowcaseFeature['id']>('friends');
  readonly activeStep = signal(0);
  readonly wallProgress = signal(0);
  readonly wallImpact = computed(() => this.clamp((this.wallProgress() - 0.22) / 0.58));
  readonly wallUnlocked = computed(() => this.wallProgress() > 0.82);

  readonly features = signal<ShowcaseFeature[]>([
    {
      id: 'friends',
      index: '01',
      eyebrow: 'GEMEINSAM STATT EINSAM',
      title: 'Freunde finden. Direkt nachjoinen.',
      text: 'Du siehst sofort, wer online ist, wo gerade gespielt wird und springst mit einem Klick ins gemeinsame Abenteuer.',
    },
    {
      id: 'rewards',
      index: '02',
      eyebrow: 'DEIN RHYTHMUS, DEINE REWARDS',
      title: 'Täglich abholen. Wöchentlich wachsen.',
      text: 'Daily Streaks halten dich im Flow. Weekly Meilensteine belohnen echte Ausdauer mit Coins, XP und seltenen Items.',
    },
    {
      id: 'chronicle',
      index: '03',
      eyebrow: 'DEINE WELT WIRD ZUR GESCHICHTE',
      title: 'Chroniken, die mit dir weiterziehen.',
      text: 'Jede Region öffnet neue Kapitel. Entscheidungen, Entdeckungen und Erfolge werden Teil deiner persönlichen Reise.',
    },
    {
      id: 'achievements',
      index: '04',
      eyebrow: 'MEHR ALS EINE CHECKLISTE',
      title: 'Geheime Pfade. Sichtbarer Fortschritt.',
      text: 'Verknüpfte Erfolge machen aus jedem Ziel eine Entdeckung – mit Badges, Abzweigungen und exklusiven Belohnungen.',
    },
  ]);

  readonly team = signal([
    { name: 'Aloxio', role: 'OWNER', focus: 'Vision & Network', hue: '#9bdd62', skinIndex: 0 },
    { name: 'LumaDev', role: 'DEVELOPMENT', focus: 'Code & Systems', hue: '#d48f67', skinIndex: 1 },
    { name: 'Nova', role: 'GAME DESIGN', focus: 'Quests & Worlds', hue: '#75aee8', skinIndex: 2 },
    { name: 'Mara', role: 'COMMUNITY', focus: 'Events & Support', hue: '#e77fa0', skinIndex: 4 },
  ]);

  readonly steps = signal<JourneyStep[]>([
    {
      number: '01',
      icon: '✦',
      title: 'Portal öffnen',
      text: 'Erstelle deinen kostenlosen Account. Dein persönlicher Hub ist sofort bereit.',
      detail: 'Account erstellt',
    },
    {
      number: '02',
      icon: '⌘',
      title: 'Spiel verbinden',
      text: 'Bestätige den einmaligen Code direkt im Minecraft-Netzwerk.',
      detail: '/link MD-7K4P',
    },
    {
      number: '03',
      icon: '◆',
      title: 'Geschichte starten',
      text: 'Fortschritt, Freunde, Rewards und Chroniken synchronisieren sich automatisch.',
      detail: 'Sync aktiv',
    },
  ]);

  readonly wallPieces = signal<WallPiece[]>(
    Array.from({ length: 72 }, (_, index) => {
      const column = index % 12;
      const row = Math.floor(index / 12);
      const centerDistance = Math.hypot(column - 5.5, row - 2.5);
      const angle = Math.atan2(row - 2.5, column - 5.5);
      return {
        x: Math.cos(angle) * (150 + centerDistance * 58),
        y: Math.sin(angle) * (110 + centerDistance * 42) + 90,
        rotation: ((index * 47) % 150) - 75,
        delay: Math.min(0.52, centerDistance * 0.065),
      };
    }),
  );

  readonly particles = signal<WallPiece[]>(
    Array.from({ length: 34 }, (_, index) => {
      const angle = (index / 34) * Math.PI * 2;
      const distance = 120 + ((index * 31) % 210);
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance + 40,
        rotation: (index * 67) % 180,
        delay: (index % 7) * 0.04,
      };
    }),
  );

  ngAfterViewInit(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        const feature = visible?.target.getAttribute('data-feature') as
          ShowcaseFeature['id'] | null;
        if (feature) this.activeFeature.set(feature);
      },
      { rootMargin: '-30% 0px -42% 0px', threshold: [0.15, 0.45, 0.75] },
    );
    this.storyBeats?.forEach((beat) => observer.observe(beat.nativeElement));
    this.destroyRef.onDestroy(() => observer.disconnect());

    if (!reducedMotion) {
      const interval = window.setInterval(
        () => this.activeStep.update((step) => (step + 1) % this.steps().length),
        3600,
      );
      this.destroyRef.onDestroy(() => window.clearInterval(interval));
    }
    this.updateWallProgress();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateWallProgress(): void {
    const section = this.wallSequence?.nativeElement;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, rect.height - window.innerHeight);
    this.wallProgress.set(this.clamp(-rect.top / travel));
  }

  setFeature(feature: ShowcaseFeature['id']): void {
    this.activeFeature.set(feature);
  }

  setStep(step: number): void {
    this.activeStep.set(step);
  }

  joinFriend(friendIndex: number): void {
    const friend = this.api.friends()[friendIndex];
    if (friend?.online) this.api.joinFriend(friend);
  }

  copyAddress(): void {
    navigator.clipboard?.writeText('play.minedesso.de');
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1800);
  }

  brickTransform(piece: WallPiece): string {
    const progress = this.clamp(
      (this.wallImpact() - piece.delay) / Math.max(0.12, 1 - piece.delay),
    );
    return `translate3d(${piece.x * progress}px, ${piece.y * progress}px, 0) rotate(${piece.rotation * progress}deg)`;
  }

  brickOpacity(piece: WallPiece): number {
    return 1 - this.clamp((this.wallImpact() - piece.delay - 0.12) * 2.4);
  }

  particleTransform(piece: WallPiece): string {
    const progress = this.clamp((this.wallImpact() - piece.delay) * 1.5);
    return `translate3d(${piece.x * progress}px, ${piece.y * progress}px, 0) rotate(${piece.rotation * progress}deg) scale(${0.25 + progress})`;
  }

  particleOpacity(piece: WallPiece): number {
    const progress = this.clamp((this.wallImpact() - piece.delay) * 1.5);
    return Math.sin(progress * Math.PI);
  }

  pickaxeTransform(): string {
    const progress = this.wallProgress();
    const swing = progress < 0.65 ? Math.sin(progress * Math.PI * 13) : 0;
    const drop = this.clamp((progress - 0.66) / 0.2);
    return `translate(-50%, -50%) translateY(${drop * 120}px) rotate(${-32 + swing * 38 + drop * 28}deg) scale(${1 - drop * 0.25})`;
  }

  private clamp(value: number): number {
    return Math.min(1, Math.max(0, value));
  }
}
