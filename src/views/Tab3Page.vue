<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Library</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleInput">
            <ion-icon :icon="showInput ? closeOutline : addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <playlist-input :showInput="showInput" @playlistCreated="handlePlaylistCreated" />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.add-button {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/vue';
import PlaylistInput from '@/components/PlaylistInput.vue';
import { ref } from 'vue';
import { addOutline, closeOutline } from 'ionicons/icons';

const showInput = ref(false);

const toggleInput = () => {
  showInput.value = !showInput.value;
  console.log("value: " + showInput.value);
};

const handlePlaylistCreated = () => {
  showInput.value = false;
};
</script>
