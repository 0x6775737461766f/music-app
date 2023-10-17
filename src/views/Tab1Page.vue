<template>
  <ion-page>
    <ion-content :fullscreen="true" class="p-4 bg-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <Player :song="selectedSong" v-if="selectedSong" @close="clearSelectedSong" />
        <div v-for="song in songs" :key="song.id" @click="selectSong(song)" class="bg-transparent p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center cursor-pointer">
          <img :src="getSongImageUrl(song)" alt="Capa do Som" class="w-16 h-16 object-cover mr-4" />
          <div>
            <h2 class="text-md font-semibold mb-1 text-white">{{ song.title }}</h2>
            <p class="text-sm text-gray-600 mb-1">{{ song.artist }}</p>
            <p class="text-sm text-gray-500">{{ formatDuration(song.duration) }}</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonList, IonItem } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import Pocketbase, { RecordModel } from 'pocketbase';
import Player from '@/components/Player.vue';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

let pb = null;
const songs = ref<RecordModel[]>([]);
const url = "https://immense-doctor.pockethost.io";
const store = useStore();

const selectedSong = ref<RecordModel | null>(null);

const selectSong = (song: RecordModel) => {
  console.log("Song selected:", song);
  selectedSong.value = song;
  console.log("Selected Song:", selectedSong.value);
  store.dispatch('selectSong', song);
};


const clearSelectedSong = () => {
  selectedSong.value = null;
};

onMounted(async () => {
  try {
    pb = new Pocketbase(url);
    const authData = await pb.admins.authWithPassword('gustavo.oliveira@exxess-markets.com', 'gpdo07062002');
    console.log(authData);
    const records: RecordModel[] = await pb.collection('songs').getFullList({
      sort: '-created',
    });
    songs.value = records;
    console.log(songs)
  } catch (e) {
    console.error(e);
  }
});

const getSongImageUrl = (song: RecordModel) => {
  const baseUrl = `${url}/api/files/`;
  const collectionId = song.collectionId;
  const recordId = song.id;
  const filename = song.cover;
  return `${baseUrl}${collectionId}/${recordId}/${filename}`;
};

const formatDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

</script>
