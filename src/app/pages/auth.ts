import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MockApiService } from '../core/mock-api.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.html',
})
export class AuthComponent {
  readonly api = inject(MockApiService);
  private readonly router = inject(Router);
  readonly registerMode = signal(false);
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  username = '';
  email = 'demo@minedesso.de';
  password = 'Minedesso42!';

  async submit(): Promise<void> {
    if (!this.email.includes('@') || this.password.length < 8) {
      this.error.set('Bitte prüfe deine Eingaben.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    await this.api.login();
    this.loading.set(false);
    await this.router.navigateByUrl(this.registerMode() ? '/link' : '/hub/overview');
  }
  demoLogin(): void {
    this.submit();
  }
}

@Component({
  selector: 'app-link-account',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './link-account.html',
})
export class LinkAccountComponent {
  readonly api = inject(MockApiService);
  private readonly router = inject(Router);
  readonly step = signal(1);
  readonly copied = signal(false);
  copy(): void {
    navigator.clipboard?.writeText('/link MD-7K4P');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
  regenerate(): void {
    this.api.showToast('Ein neuer Linking-Code wurde erstellt.');
  }
  verify(): void {
    this.step.set(2);
    this.api.linkAccount();
  }
  finish(): void {
    this.router.navigateByUrl('/hub/overview');
  }
}
