import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    city: string = '';
    weatherData: any = null;
    hourlyForecast: any[] = [];  // Store hourly forecast data
    errorMessage: string = '';
    weatherIconUrl: string = ''; 
  
    constructor(private http: HttpClient) {}
  
    // Fetch weather data from the backend
    getWeather() {
      if (!this.city.trim()) {
        this.errorMessage = 'Please enter a city name.';
        return;
      }
  
      this.errorMessage = '';
      this.weatherData = null;
      this.hourlyForecast = [];  // Reset hourly forecast
  
      const apiUrl = `http://localhost:3000/weather/${this.city}`;
      this.http.get(apiUrl).subscribe({
        next: (data) => {
          this.weatherData = data;
          console.log('Weather Data:', this.weatherData);
  
          // Assuming weatherData contains the hourly forecast:
          this.hourlyForecast = this.weatherData.hourly;  // Adjust as per the API structure
  
          // Set the weather icon URL
          this.weatherIconUrl = this.weatherData.iconUrl;
        },
        error: (error) => {
          this.errorMessage = 'Failed to fetch weather data.';
          console.error(error);
        }
      });
    }
  }
