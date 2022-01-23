import { Component } from '@angular/core';
import {
  baseLayerLuminance,
  StandardLuminance,
} from '@fluentui/web-components';

@Component({
  selector: 'mwe-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'net6-markdown-web-engine';

  constructor() {
    baseLayerLuminance.withDefault(StandardLuminance.LightMode);
  }
}
