export const isCityDuplicate = (city) => {
  const citiesData = localStorage.getItem("citiesData");

  if (!citiesData) {
    return false;
  }

  const cities = JSON.parse(citiesData);
  return cities.some((storedCity) => storedCity.id === city.id);
};

export const saveToLocalStorage = (data) => {
  localStorage.setItem("citiesData", JSON.stringify(data));
};

export const formatate = (dt) => {
  const date = new Date(dt * 1000);
  return date.toLocaleTimeString();
};

export const addToFavorite = (id, store) => {
  const cityToAdd = store.state.cities[id];
  if (!isCityDuplicate(cityToAdd)) {
    const citiesData = localStorage.getItem("citiesData");
    let cities = [];
    if (citiesData) {
      cities = JSON.parse(citiesData);
    }
    cities.push(cityToAdd);
    saveToLocalStorage(cities);
  }
};

export const removeFromFavorite = (id, store) => {
  const citiesData = localStorage.getItem("citiesData");
  if (citiesData) {
    let cities = JSON.parse(citiesData);
    const index = cities.findIndex((city) => city.id === id);
    if (index !== -1) {
      cities.splice(index, 1);
      saveToLocalStorage(cities);
    }
  }
};

export const toChartData = (reactiveChartData) => {
  return {
    labels: reactiveChartData.labels,
    datasets: reactiveChartData.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.slice(),
    })),
  };
};
