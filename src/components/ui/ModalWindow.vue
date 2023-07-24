<script setup>
import { defineEmits, defineProps } from "vue";
const props = defineProps({
  name: String,
  id: Number,
});
const emit = defineEmits(["remove"]);
const handleResponse = (res) => {
  emit("remove", res);
};
</script>

<template>
  <div>Do you want to delete {{ props.name }} forecast ?</div>
  <button @click="handleResponse(false)">No</button>
  <button @click="handleResponse(props.id)">Yes</button>
</template>
<style></style>
