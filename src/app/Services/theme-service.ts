import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = signal(false);

  toggleTheme() {
    this.darkMode.update(v => !v);
  }

  isDark() {
    return this.darkMode();
  }
}
