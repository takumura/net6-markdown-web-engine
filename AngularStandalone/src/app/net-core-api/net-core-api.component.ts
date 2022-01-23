import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-net-core-api',
  templateUrl: './net-core-api.component.html',
  styleUrls: ['./net-core-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetCoreApiComponent {
  public forecasts?: WeatherForecast[];

  constructor(http: HttpClient) {
    http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => console.error(error)
    );
  }

  title = 'net6-markdown-web-engine';
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
