'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--temp');
const inputElevation = document.querySelector('.form__input--climb');

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(
        `https://www.google.com.ua/maps/@${latitude},${longitude},14z?entry=ttu`
      );

      const coords = [latitude, longitude];

      const map = L.map('map').setView(coords, 13);
      console.log(map);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', function (mapEvent) {
        console.log(mapEvent);

        const { lat, lng } = mapEvent.latlng;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 200,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: 'running-popup',
            })
          )
          .setPopupContent('Тренировка')
          .openPopup();
      });
    },
    function () {
      alert('Unable to get your location!');
    }
  );
