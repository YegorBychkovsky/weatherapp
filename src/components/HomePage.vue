<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import ModalWindow from "../components/ui/ModalWindow.vue";
import { cityTemplate } from "../utils/constants";
import WeatherCard from "./WeatherCard.vue";

const store = useStore();
const cities = ref([
  {
    base: "",
    clouds: { all: 0 },
    cod: 0,
    coord: { lon: 0, lat: 0 },
    dt: 0,
    id: 0,
    main: {
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
    },
    name: "",
    sys: { country: "", sunrise: 0, sunset: 0 },
    timezone: 0,
    visibility: 0,
    weather: {
      id: 0,
      main: "",
      description: "",
      icon: "",
    },
    wind: { speed: 0, deg: 0, gust: 0 },
  },
]);
const deleteWindow = ref(false);
const removeCityName = ref("");
const removeCityId = ref(0);

const addCity = () => {
  if (store.state.cities.length < 5) {
    const city = { ...cityTemplate };
    city.id = cities.value.length;
    city.name = "";
    store.commit("addCity", city);
    cities.value.push(city);
  }
};
const removeCity = (res) => {
  res
    ? (store.commit("filterCities", res),
      (cities.value = cities.value.filter((item) => {
        return item.id !== res;
      })),
      (deleteWindow.value = false))
    : (deleteWindow.value = false);
};
const removeAccepting = (id) => {
  deleteWindow.value = true;
  const index = cities.value.findIndex((city) => city.id === id);
  removeCityName.value = cities.value[index]?.name;
  removeCityId.value = id;
};

const addData = ({ city, id }) => {
  cities.value[id] = city;
};
</script>

<template>
  <div style="display: flex">
    <button @click="addCity()">+</button>
  </div>
  <ModalWindow
    v-if="deleteWindow"
    :name="removeCityName"
    :id="removeCityId"
    @remove="removeCity"
  />
  <div v-else style="display: flex; flex-wrap: wrap">
    <WeatherCard
      v-for="(city, i) in cities"
      :key="i"
      :id="i"
      :city="city"
      :name="city.name"
      :description="city.weather[0]?.description"
      :sunrise="city.sys?.sunrise"
      :sunset="city.sys?.sunset"
      :temp="city.main?.temp"
      :feelsLike="city.main?.feels_like"
      :windSpeed="city.wind.speed"
      @remove="removeAccepting"
      @fetch="addData"
    />
  </div>
</template>

<style scoped></style>
