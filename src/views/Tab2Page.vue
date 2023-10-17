<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="bg-black text-white">
        <ion-buttons slot="start">
          <ion-back-button class="text-white"></ion-back-button>
        </ion-buttons>
        <ion-searchbar
          placeholder="Search"
          @ionInput="handleSearchInput"
          :blurOnEnter="true"
          class="text-white"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="searchResults.length > 0">
        <h2 class="text-white mb-4">Search results:</h2>
        <ul>
          <li v-for="result in searchResults" :key="result.id" class="mb-4 flex items-center">
            <img :src="getSongImageUrl(result)" alt="Cover Image" class="w-16 h-16 object-cover rounded-full mr-4" />
            <div>
              <h3 class="text-lg font-semibold">{{ result.name }}</h3>
            </div>
          </li>
        </ul>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonSearchbar, IonContent } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import Pocketbase, { RecordModel } from 'pocketbase';

const url = "https://immense-doctor.pockethost.io";
const pb: Pocketbase = new Pocketbase(url);

let searchTimeout: NodeJS.Timeout | null = null;

onMounted(async () => {
  try {
    const authData = await pb.admins.authWithPassword('gustavo.oliveira@exxess-markets.com', 'gpdo07062002');
    console.log(authData);
  } catch (e) {
    console.error(e);
  }
});

interface SearchResult {
  id: number;
  name: string;
  cover: string;
  collectionId: string;
}

const searchResults = ref<SearchResult[]>([]);

const handleSearchInput = async (event: CustomEvent) => {
  const searchTerm = event.detail.value;
  
  // Limpa o timeout anterior se existir
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(async () => {
    try {
      const resultList = await pb.collection('songs').getList(1, 20 ,{
        filter: `title ~ "${searchTerm}"`
      });
      
      const formattedResults: SearchResult[] = resultList.items.map((item: any) => ({
        id: item.id,
        name: item.title,
        cover: item.cover,
        collectionId: item.collectionId
      }));
      searchResults.value = formattedResults;
      if (formattedResults.length === 0) {
        // Atualiza searchResults com a mensagem de sem resultados
        searchResults.value = [{
          id: 0,
          name: `No search results for: "${searchTerm}"`,
          cover: '',
          collectionId: ''
        }];
      }
    } catch (error) {
      console.error(error);
    }
  }, 300);
};

const getSongImageUrl = (song: SearchResult) => {
  const baseUrl = `${url}/api/files/`;
  const collectionId = song.collectionId;
  const recordId = song.id;
  const filename = song.cover;
  return `${baseUrl}${collectionId}/${recordId}/${filename}`;
};
</script>
