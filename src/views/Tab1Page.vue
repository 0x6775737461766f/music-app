<template>
  <ion-page>
    <ion-content :fullscreen="true" class="p-4 bg-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <div v-for="song in songs" :key="song.id" @click="selectSong(song)" class="bg-transparent p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center cursor-pointer">
        <img :src="getSongImageUrl(song)" alt="Song Cover" class="w-16 h-16 object-cover mr-4" />
        <div :class="{ 'text-purple-500': isSelectedSong(song) }">
          <h2 class="text-md font-semibold mb-1">{{ song.title }}</h2>
          <p class="text-sm text-gray-600 mb-1">{{ song.expand.artists.map(artist => artist.name).join(' | ') }}</p>
          <p class="text-sm text-gray-500">{{ formatDuration(song.duration) }}</p>
        </div>
      </div>
      </div>
    <Player :song="selectedSong" v-if="selectedSong" @close="clearSelectedSong" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonList, IonItem } from '@ionic/vue';
import Pocketbase, { RecordModel } from 'pocketbase';
import Player from '@/components/Player.vue';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

let pb: Pocketbase | null = null;
const songs = ref<RecordModel[]>([]);
const url = "https://immense-doctor.pockethost.io";
const store = useStore();
const selectedSong = ref<RecordModel | null>(null);

const isSelectedSong = (song: RecordModel) => {
  return selectedSong.value !== null && selectedSong.value.id === song.id;
};

const selectSong = (song: RecordModel) => {
  console.log("Song selected:", song);
  selectedSong.value = song;
  console.log("Selected Song:", selectedSong.value);
  store.dispatch('selectSong', song);
};


const clearSelectedSong = () => {
  selectedSong.value = null;
};

const fetchSongs = async () => {
  try {
    if (!pb) {
      pb = new Pocketbase(url);
    }
    const authData = await pb.admins.authWithPassword('gustavo.oliveira@exxess-markets.com', 'gpdo07062002');
    console.log(authData);
    const records: RecordModel[] = await pb.collection('songs').getFullList({
      sort: '-created',
      expand: "artists"
    });
    songs.value = records;
    console.log(songs)
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchSongs);

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
