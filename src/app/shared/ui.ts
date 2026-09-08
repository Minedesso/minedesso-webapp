import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'm-avatar',
  standalone: true,
  templateUrl: './avatar.html',
})
export class AvatarComponent {
  readonly name = input.required<string>();
  readonly hue = input('#8fcb63');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly src = input('/assets/player-skins.png');
  readonly skinIndex = input<number | null>(null);
  readonly resolvedSkinIndex = computed(() => {
    const explicit = this.skinIndex();
    if (explicit !== null) return Math.min(4, Math.max(0, explicit));
    return [...this.name()].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 5;
  });
}

@Component({
  selector: 'm-progress',
  standalone: true,
  templateUrl: './progress.html',
  imports: [CommonModule],
})
export class ProgressComponent {
  readonly value = input.required<number>();
  readonly max = input.required<number>();
  readonly label = input('Fortschritt');
  readonly suffix = input('');
  get percentage(): number {
    return Math.min(100, Math.max(0, (this.value() / this.max()) * 100));
  }
}

@Component({
  selector: 'm-status',
  standalone: true,
  templateUrl: './status.html',
})
export class StatusComponent {
  readonly label = input.required<string>();
  readonly tone = input<'online' | 'offline' | 'warning' | 'info' | 'success'>('info');
}

@Component({
  selector: 'm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly eyebrow = input('Sichere Aktion');
  readonly closed = output<void>();
  readonly modalTitle = `modal-${Math.random().toString(36).slice(2)}`;
}

@Component({
  selector: 'm-page-state',
  standalone: true,
  templateUrl: './page-state.html',
})
export class PageStateComponent {
  readonly type = input<'loading' | 'empty' | 'error' | 'offline'>('loading');
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
