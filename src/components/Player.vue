<template>
  <div class="fixed bottom-0 left-0 w-full bg-black bg-opacity-70 backdrop-blur-sm p-1">
    <div class="flex items-center justify-between text-white mb-2">
      <div class="flex items-center space-x-2">
        <img :src="getSongImageUrl(props.song)" alt="Capa da Música" class="w-12 h-12 object-cover">

        <div class="flex flex-col">
          <p class="text-sm">{{ props.song.title }}</p>
          <p class="text-xs text-gray-500">{{ props.song.expand.artists.map(artist => artist.name).join(' | ') }}</p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <ion-icon @click="toggleAudio" :icon="isPlaying ? pause : play" class="text-3xl"></ion-icon>
        <ion-icon @click="closePlayerHandler" :icon="closeOutline" class="text-4xl text-red-500 text-opacity-70"></ion-icon>
      </div>
    </div>
    <div class="h-1 bg-gray-400">
      <div :style="{ width: progress + '%' }" class="h-full bg-white"></div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { pause, play, closeOutline } from "ionicons/icons";
import { ref, onMounted, getCurrentInstance, onBeforeUnmount, watch } from "vue";
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

const emits = defineEmits();
const closePlayerHandler = () => {
  emits("close"); // Emite o evento close
};

const audio = ref(new Audio());
const isPlaying = ref(false);
const progress = ref(0);

const toggleAudio = async () => {
  const audioUrl = await getAudioUrl(props.song);

  // Se o áudio ainda não foi carregado, configure a fonte
  if (audio.value.src !== audioUrl) {
    audio.value.src = audioUrl;
    await audio.value.load();
  }

  // Verifica se o áudio está pronto antes de definir a posição
  await audio.value.play();
  audio.value.pause();
  
  // Calcula o tempo com base no progresso e na duração do áudio
  const newTime = progress.value * audio.value.duration;

  // Verifica se o novo tempo é um número finito e está dentro dos limites da duração
  if (isFinite(newTime) && newTime >= 0 && newTime <= audio.value.duration) {
    audio.value.currentTime = newTime;
  }

  // Tenta iniciar ou pausar a reprodução
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
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

const getSongImageUrl = (song: RecordModel) => {
  const baseUrl = `${url}/api/files/`;
  const collectionId = song.collectionId;
  const recordId = song.id;
  const filename = song.cover;
  return `${baseUrl}${collectionId}/${recordId}/${filename}`;
};

onMounted(() => {
  toggleAudio();
  setInterval(() => {
    progress.value = (audio.value.currentTime / audio.value.duration) * 100;
  }, 100);
});

watch(() => props.song, (newSong, oldSong) => {
  audio.value.pause();
  isPlaying.value = false;
  toggleAudio();
});

onBeforeUnmount(() => {
  audio.value.pause();
  audio.value.removeEventListener('timeupdate', () => {
    progress.value = (audio.value.currentTime / audio.value.duration) * 100;
  });
});
</script>
