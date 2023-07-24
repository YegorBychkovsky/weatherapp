<script setup>
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { onMounted, ref, watch, watchEffect } from "vue";
import { Line } from "vue-chartjs";
import { useStore } from "vuex";
import { formatate, toChartData } from "../utils/utilsFunctions";

const props = defineProps({
  lat: Number,
  lon: Number,
  cityArrId: Number,
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
const store = useStore();
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Temperature",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      data: [],
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
let chartKey = ref(0);
const quality = ref(8);

const fetchChart = async (lat, lon, qlt) => {
  const data = await store.dispatch("fetchForecastData", {
    lat,
    lon,
    qlt,
  });
  chartData.value.labels = [];
  chartData.value.datasets[0].data = [];
  for (const cycle of data.list) {
    chartData.value.labels.push(formatate(cycle.dt).toString());
    chartData.value.datasets[0].data.push(Math.ceil(cycle.main.temp));
  }
};

watchEffect(() => {
  chartKey.value++;
});

const forecast = (qlt) => {
  if (props.lat && props.lon) {
    quality.value = qlt;
    fetchChart(props.lat, props.lon, qlt);
  }
};

onMounted(() => {
  if (props.lat && props.lon) {
    const qlt = quality.value;
    fetchChart(props.lat, props.lon, qlt);
  }
  watch(
    () => store.state.buttonClicked,
    () => {
      if (store.state.cities[props.cityArrId]) {
        const lat = store.state.cities[props.cityArrId]?.coord.lat;
        const lon = store.state.cities[props.cityArrId]?.coord.lon;
        const qlt = quality.value;
        fetchChart(lat, lon, qlt);
        const a = toChartData(chartData.value);
      }
    },
  );
});
</script>
<script></script>
<template>
  <div>
    <Line
      v-if="props.lat && props.lon"
      :data="toChartData(chartData)"
      :options="chartOptions"
      :key="chartKey"
    />
    <button @click="forecast(8)">forecast for day</button>
    <button @click="forecast(24)">forecast for 3 days</button>
  </div>
</template>
