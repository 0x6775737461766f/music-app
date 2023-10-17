<template>
  <div class="fixed bottom-0 left-0 w-full h-20 md:h-40 flex justify-between items-center text-white transition duration-300 backdrop-blur-sm bg-black bg-opacity-60">
    <div class="flex items-center space-x-4 p-4">
      <p class="text-sm">{{ props.song.title }}</p>
      <p class="text-xs text-gray-500">{{ formatDuration(props.song.duration) }}</p>
    </div>
    <div class="flex items-center space-x-4 p-4">
      <ion-icon @click="toggleAudio" :icon="isPlaying ? pause : play" class="text-3xl"></ion-icon>
      <ion-icon @click="closePlayer" :icon="closeOutline" class="text-4xl text-red-500"></ion-icon>
    </div>
  </div>
</template>

  
  <script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { pause, play, closeOutline } from "ionicons/icons";
import { ref, onMounted, computed, getCurrentInstance, onBeforeUnmount, watch } from "vue";
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

const url = "https://immense-doctor.pockethost.io";

const formatDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const closePlayer = () => {
  ctx?.emit('close');
};

const audio = new Audio();
const isPlaying = ref(false);
const expanded = ref(false);

const toggleAudio = async () => {
  const audioUrl = await getAudioUrl(props.song);
  if (isPlaying.value) {
    audio.pause();
  } else {
    audio.src = audioUrl;
    await audio.play();
  }
  isPlaying.value = !isPlaying.value;
};

const getAudioUrl = async (song: RecordModel) => {
  const baseUrl = `${url}/api/files/`;
  const collectionId = song.collectionId;
  const recordId = song.id;
  const filename = song.song;
  return `${baseUrl}${collectionId}/${recordId}/${filename}`;
};

onMounted(() => {
  toggleAudio();
});

watch(() => props.song, (newSong, oldSong) => {
  // Pausar o áudio existente quando a música é alterada
  audio.pause();
  isPlaying.value = false;
  // Iniciar a reprodução da nova música automaticamente
  toggleAudio();
});

onBeforeUnmount(() => {
  audio.pause();
});

const togglePlayerSize = () => {
  expanded.value = !expanded.value;
};

</script>

  
  