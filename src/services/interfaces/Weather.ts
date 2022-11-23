export interface AbstractDayWeather {
  temp: string
  icon: string
  day: string
}

export interface CurrentWeatherData {
  currentTemperature: number
  feelsLike: number
  highTemperature: number
  lowTemperature: number
  windSpeed: number
  humidity: number
  pressure: number
  sunrise: string
  sunset: string
}

export interface WeatherDescription {
  id: number
  icon: string
  main: string
  description: string
}

export interface Location {
  name: string
  country: string
  lon: number
  lat: number
  timezone: number
  date: number // unix time
}
