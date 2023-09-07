'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // km
    this.duration = duration; // min
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, temp) {
    super(coords, distance, duration);
    this.temp = temp;
    this.calculatePace();
  }

  calculatePace() {
    // min/km
    this.pace = this.duration / this.distance;
  }
}
class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, climb) {
    super(coords, distance, duration);
    this.climb = climb;
    this.calculateSpeed();
  }

  calculateSpeed() {
    // km/h
    this.speed = this.distance / this.duration / 60;
  }
}

const running = new Running([50, 39], 7, 40, 170);
const cycling = new Cycling([50, 39], 37, 80, 370);
console.log(running, cycling);

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleClinbField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Невозможно получить ваше местоположение!');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(
      `https://www.google.com.ua/maps/@${latitude},${longitude},14z?entry=ttu`
    );

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);
    console.log(this.#map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Map click handling
    this.#map.on('click', this._showFrom.bind(this));
  }

  _showFrom(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleClinbField() {
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const areNumbers = (...numbers) =>
      numbers.every((num) => Number.isFinite(num));

    const areNumbersPositive = (...numbers) => numbers.every((num) => num > 0);

    e.preventDefault();

    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // Getting data from a form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // If the workout is a run, then create a Running object
    if (type === 'running') {
      const temp = +inputTemp.value;
      // Data validation
      if (
        !areNumbers(distance, duration, temp) ||
        !areNumbersPositive(distance, duration, temp)
      )
        return alert('Введите положительное число!');

      workout = new Running([lat, lng], distance, duration, temp);
    }

    // If the workout is a cycling training, then create a Cycling object
    if (type === 'cycling') {
      const climb = +inputClimb.value;
      // Data validation
      if (
        !areNumbers(distance, duration, climb) ||
        !areNumbersPositive(distance, duration)
      )
        return alert('Введите положительное число!');
      workout = new Cycling([lat, lng], distance, duration, climb);
    }

    // Add a new object to a new training array
    this.#workouts.push(workout);
    console.log(workout);

    // Display the workout on the map and then display the workout in the list
    this._displayWorkout(workout);

    // Hide form and clear input field data

    // Clearing data entry fields
    inputDistance.value =
      inputDuration.value =
      inputTemp.value =
      inputClimb.value =
        '';
  }

  _displayWorkout(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('Тренировка')
      .openPopup();
  }
}

const app = new App();
