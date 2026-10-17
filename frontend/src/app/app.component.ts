import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonApp } from '@ionic/angular';

@Component({
  selector: 'app-root',
  imports: [IonApp, RouterOutlet],
  template: `
    <ion-app>
      <router-outlet />
    </ion-app>
  `,
  styles: `
    ion-app {
      position: relative;
      height: auto;
      min-height: 100%;
      overflow: visible;
      contain: none;
    }
  `,
})
export class AppComponent {}
