<script setup>
import { reactive } from "vue";
import WeatherCard from "../components/WeatherCard.vue";

// Создаем реактивную обертку вокруг citiesData с помощью reactive
const citiesData = reactive(
  JSON.parse(localStorage.getItem("citiesData")),
);
</script>

<template>
  <div style="display: flex; flex-wrap: wrap">
    <WeatherCard
      v-for="(city, i) in citiesData"
      :key="i"
      :citiesArrId="i"
      :id="city.id"
      :city="city"
      :name="city.name"
      :description="city?.weather[0]?.description"
      :sunrise="city?.sys?.sunrise"
      :sunset="city?.sys?.sunset"
      :temp="city?.main?.temp"
      :feelsLike="city?.main?.feels_like"
      :windSpeed="city?.wind?.speed"
    />
  </div>
</template>

<style scoped></style>
