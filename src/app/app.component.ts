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
    currentTemperature: string = '';
    currentFeelslikeTemp: string = '';
    tempMax: string = '';
    tempMin: string = '';
    weatherIconClass: string = '';
  
    constructor(private http: HttpClient) {}
  
    // Fetch weather data from the backend
    getWeather() {
      if (!this.city.trim()) {
        this.errorMessage = 'Please enter a city name.';
        return;
      }
  
      this.errorMessage = '';
      this.weatherData = null;
      this.hourlyForecast = [];
      this.weatherIconClass = '';
      
      const apiUrl = `http://localhost:3000/weather/${this.city}`;
      this.http.get(apiUrl).subscribe({
        next: (data) => {
          this.weatherData = data;
          console.log('Weather Data:', this.weatherData);
          this.currentTemperature = String(Math.trunc(((this.weatherData.currentConditions.temp - 32) * 5/9)));
          this.currentFeelslikeTemp = String(Math.trunc(((this.weatherData.currentConditions.feelslike - 32) * 5/9)));

          const condition = this.weatherData.currentConditions.conditions;
          console.log('Condition:', condition); // Debugging log for the condition
          this.weatherIconClass = this.getWeatherIconClass(condition);
          // Find the temperature for the current day
          const currentDay = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
          const currentDayData = this.weatherData.days.find((day: any) => day.datetime === currentDay);

          if (currentDayData) {
            this.tempMin = String(Math.trunc(((currentDayData.tempmin - 32) * 5 / 9)));
            this.tempMax = String(Math.trunc(((currentDayData.tempmax - 32) * 5 / 9)));
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to fetch weather data.';
          console.error(error);
        }
      });
    }

    getWeatherIconClass(condition: string): string {
      const descriptionMap: { [key: string]: string } = {
        'Partially cloudy': 'wi wi-day-cloudy',
        'Rain': 'wi wi-rain',
        'Rain, Overcast': 'wi wi-hail',
        'Snow': 'wi wi-snow',
        'Thunderstorm': 'wi wi-thunderstorm',
        'Fog': 'wi wi-fog',
        'Overcast': 'wi wi-cloudy',
        'Clear': 'wi wi-day-sunny',
      };
    
      // Return the matching icon class or a default icon
      return descriptionMap[condition] || 'wi-na';
    }    
  }
