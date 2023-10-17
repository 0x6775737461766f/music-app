<template>
    <div class="p-4 bg-white shadow rounded-md">
      <h2 class="text-lg font-semibold mb-2 text-black">{{ song.title }}</h2>
      <p class="text-sm text-gray-600 mb-2">{{ song.artist }}</p>
      <p class="text-sm text-gray-500">{{ formatDuration(song.duration) }}</p>
      <button @click="toggleAudio" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button @click="closePlayer" class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none">
        Fechar
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useStore } from 'vuex';
import { RecordModel } from "pocketbase";

const store = useStore();
const ctx = getCurrentInstance();

const props = defineProps({
  song: {
    type: Object as () => RecordModel,
    required: true,
  },
});

const isPlaying = computed(() => store.getters.isPlaying);

const toggleAudio = () => {
  if (isPlaying.value) {
    store.dispatch('setIsPlaying', false);
    store.state.audio.pause();
  } else {
    store.dispatch('setIsPlaying', true);
    store.state.audio.play();
  }
};

const formatDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const closePlayer = () => {
  ctx?.emit('close');
};

onMounted(() => {
  console.log("Player component mounted");
});
</script>

  
  