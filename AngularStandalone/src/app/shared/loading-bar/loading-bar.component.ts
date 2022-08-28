import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoadingBarService } from './loading-bar.service';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent {
  constructor(public loadingBarService: LoadingBarService) {}
}
