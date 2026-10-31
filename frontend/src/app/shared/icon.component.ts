import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      @switch (name()) {
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('up') {
          <path d="M12 19V5M6 11l6-6 6 6" />
        }
        @case ('down') {
          <path d="M12 5v14M6 13l6 6 6-6" />
        }
        @case ('edit') {
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        }
        @case ('eye') {
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        }
        @case ('eye-off') {
          <path d="M3 3l18 18" />
          <path d="M10.6 6.2A10 10 0 0 1 12 6c6 0 10 6 10 6a18 18 0 0 1-3.1 3.7" />
          <path d="M6.1 6.1C3.6 8 2 12 2 12a18 18 0 0 0 6.1 5.5" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        }
        @case ('trash') {
          <path d="M4 7h16" />
          <path d="M9 7V5h6v2" />
          <path d="M8 7l1 13h6l1-13" />
        }
        @case ('check') {
          <path d="M5 12l5 5L20 7" />
        }
        @case ('back') {
          <path d="M19 12H5M11 18l-6-6 6-6" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 16px;
      height: 16px;
      flex: none;
    }

    svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<'plus' | 'up' | 'down' | 'edit' | 'eye' | 'eye-off' | 'trash' | 'check' | 'back'>();
}
