import axios from "axios";
import { createStore } from "vuex";
import { cityTemplate } from "../utils/constants";

export default createStore({
  state: {
    cities: [cityTemplate],
    buttonClicked: false,
  },
  mutations: {
    addCity(state, city) {
      state.cities.push(city);
    },
    filterCities(state, id) {
      state.cities = state.cities.filter((item) => {
        return item.id !== id;
      });
      state.buttonClicked = !state.buttonClicked;
    },
  },
  actions: {
    async fetchCity({ state }, { cityName, id }) {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=336469a84cf93232f3584a789087de6c`;
      const { data } = await axios.get(url);
      state.cities[id].lat = data[0].lat;
      state.cities[id].lon = data[0].lon;
      state.cities[id].name = cityName;
      return data;
    },
    async fetchWeather({ state }, { lat, lon, id }) {
      if (state.cities.length < 6) {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=Metric&appid=336469a84cf93232f3584a789087de6c`;
          const { data } = await axios.get(url);
          state.cities[id] = { ...data };
          return data;
        } catch (error) {
          console.error(error);
        }
      }
    },
    async fetchForecastData({}, { lat, lon, qlt }) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=Metric&cnt=${qlt}&appid=336469a84cf93232f3584a789087de6c`;
        const { data } = await axios.get(url);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
