# weather-app

This is a weather-app built on top of Vue 3 in Vite.

## Features and review notes
- [ ] Responsive and has helpful loaders and toasts for loading and errors.
- [ ] There's a location input where a user can enter a city name.
- [ ] The app will fetch the weather data for the city entered.
- [ ] The app will display the weather overview info of:
  - [ ] Location name
  - [ ] Temperature
  - [ ] Weather description
  - [ ] High and low temperatures
- [ ] The app will display additional weather info of(in the toggled component of the weather overview):
  - [ ] Humidity
  - [ ] Wind speed
  - [ ] Feels like
  - [ ] Pressure
  - [ ] Sunrise and sunset times
- [ ] The app will display a list of the 7 upcoming days of the weather forecast.
- [ ] The app will display a list of the 5 past days of the weather forecast.
- [ ] The app is hosted on a Heroku account and can be accessed [here](https://too-collins-weather-app.herokuapp.com/).

## Project Setup

```sh
yarn install
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
yarn test:e2e # or `yarn test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
