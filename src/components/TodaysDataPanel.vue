<script setup>
import { defineProps } from "vue";
import { formatate as formatted } from "../utils/utilsFunctions";
const props = defineProps({
  description: String,
  sunrise: Number,
  sunset: Number,
  temp: Number,
  feelsLike: Number,
  windSpeed: Number,
});
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <tr style="display: inline-block">
      <td>description: {{ props.description }}</td>
      <td>sunrise: {{ formatted(props.sunrise) + "AM" }}</td>
      <td>sunset: {{ formatted(props.sunset) + "PM" }}</td>
    </tr>
    <tr style="display: intdne-block">
      <td>temp: {{ props.temp }}℃</td>
      <td>feels like: {{ props.feelsLike }}℃</td>
      <td>wind speed: {{ props.windSpeed }} m/s</td>
    </tr>
  </div>
</template>
<style></style>
