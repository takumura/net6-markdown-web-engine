import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject,  } from 'rxjs';

@Component({
  selector: 'app-net-core-api',
  templateUrl: './net-core-api.component.html',
  styleUrls: ['./net-core-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetCoreApiComponent {
  public forecastsSub: BehaviorSubject<WeatherForecast[]> = new BehaviorSubject<WeatherForecast[]>([]);
  public forecasts$: Observable<WeatherForecast[]> = this.forecastsSub.asObservable();

  constructor(http: HttpClient) {
    http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecastsSub.next(result);
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
