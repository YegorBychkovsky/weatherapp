<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  addToFavorite,
  formatate,
  removeFromFavorite,
} from "../utils/utilsFunctions";
import ChartComponent from "./ChartComponent.vue";

const props = defineProps({
  key: Number,
  citiesArrId: Number,
  id: Number,
  city: Object,
  name: String,
  description: String,
  sunrise: Number,
  sunset: Number,
  temp: Number,
  feelsLike: Number,
  windSpeed: Number,
});

const emit = defineEmits(["remove", "fetch"]);

const store = useStore();
const city = ref(props.city);
const cityName = ref(props.name || "");
const isFavorite = ref(false);
const isActive = ref(true);
const Path = ref(window.location.pathname);
const citiesData = ref(JSON.parse(localStorage.getItem("citiesData")));

const fetchData = async () => {
  city.value = await store.dispatch("fetchCity", {
    cityName: cityName.value,
    id: props.id,
  });

  city.value = await store.dispatch("fetchWeather", {
    lat: city.value[0].lat,
    lon: city.value[0].lon,
    id: props.id,
  });
  cityName.value = city.value.name;
};

const saveToLocalStorage = () => {
  isFavorite.value = true;
  addToFavorite(props.id, store);
};

const deleteFromLocalStorage = () => {
  isFavorite.value = false;
  isActive.value = false;
  removeFromFavorite(props.id, store);
  store.commit("setButtonClicked");
};
watch(store.state.cities, () => {
  if (Path.value !== "/favorites") {
    city.value = store.state.cities[props.id];
    cityName.value = city.value.name;
  }
});
watch(
  () => store.state.buttonClicked,
  () => {
    if (Path.value === "/favorites") {
      citiesData.value = JSON.parse(localStorage.getItem("citiesData"));
      city.value = citiesData.value[props.citiesArrId];
      cityName.value = city.value?.name;
    } else if (Path.value !== "/favorites") {
      cityName.value = props.name;
    }
  },
);
const handleRemove = () => {
  console.log(props.city.id);
  emit("remove", props.city.id);
};
const handleFetch = async () => {
  await fetchData();
  emit("fetch", { city: city.value, id: props.id });
};
</script>

<template>
  <div
    style="
      padding: 20px;
      width: 590px;
      margin: 30px;
      border: 1px solid black;
      position: relative;
    "
    :class="{
      'active-forecast': isActive === false && Path === '/favorites',
    }"
  >
    <button
      style="position: absolute; right: 50px; top: 15px; font-size: 11px"
      @click="
        isFavorite || Path === '/favorites'
          ? deleteFromLocalStorage()
          : saveToLocalStorage()
      "
      :class="{
        'favorite-button': isFavorite || Path === '/favorites',
      }"
    >
      ★
    </button>
    <button
      v-if="Path !== '/favorites'"
      style="position: absolute; right: 20px; top: 15px"
      @click="handleRemove"
      :disabled="store.state.afterDelPause"
    >
      Х
    </button>
    <div style="justify-content: center">
      <b> TODAY'S WEATHER FORECAST IN </b>
      <div>
        <input
          type="text"
          v-model="cityName"
          :readonly="Path === '/favorites'"
          @keyup.enter="handleFetch"
          placeholder="city"
          style="margin-top: 10px"
        />
      </div>
    </div>
    <br />
    <br />
    <div
      style="display: flex; justify-content: space-between"
      v-if="city && city.weather && city.weather.length > 0"
    >
      <tr style="display: inline-block">
        <td>description: {{ props.description }}</td>
        <td>sunrise: {{ formatate(props.sunrise) + "AM" }}</td>
        <td>sunset: {{ formatate(props.sunset) + "PM" }}</td>
      </tr>
      <tr style="display: intdne-block">
        <td>temp: {{ props.temp }}℃</td>
        <td>feels like: {{ props.feelsLike }}℃</td>
        <td>wind speed: {{ props.windSpeed }} m/s</td>
      </tr>
    </div>
    <ChartComponent
      style="height: 250px"
      v-if="city && city.weather && city.weather.length > 0"
      :lat="city.coord?.lat"
      :lon="city.coord?.lon"
      :cityArrId="props.id"
    />
  </div>
</template>
<style>
.favorite-button {
  color: white;
  background: green;
}
.active-forecast {
  display: none;
}
</style>
