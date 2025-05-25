<script setup>
import { computed } from "vue";
const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: null,
  },
  iscallcenter: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div v-if="!iscallcenter" class="flex items-start mb-2">
      
    <div class="ml-4 bg-gray-100 p-4 rounded-lg">
      <p class="text-gray-800 max-w-50 break-words">{{ message }}</p>
      <span class="text-gray-500 text-sm">{{ date }}</span>
    </div>
  </div>
  <div v-else class="flex items-end mb-2 justify-end">
    <div class="mr-4 bg-blue-500 text-white p-4 rounded-lg">
      <p class="max-w-50 break-words">{{ message }}</p>
      <span class="text-gray-200 text-sm">{{ date }}</span>
    </div>

  </div>
</template>
<style scoped>
.max-w-50 {
  max-width: 50vw;
  word-wrap: break-word;
}
</style>
