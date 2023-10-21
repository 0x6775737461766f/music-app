<template>
    <div v-if="showInput" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-black p-4 rounded-lg shadow-lg">
        <ion-input v-model="playlistName" placeholder="Enter playlist name" class="mb-4"></ion-input>
        <ion-button @click="createPlaylist" class="w-full">Create Playlist</ion-button>
        <p v-if="playlistName.trim() === ''" class="text-red-500 mt-2">Please enter a playlist name.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { IonInput, IonButton } from '@ionic/vue';
  import { ref, PropType, onMounted } from 'vue';
  import Pocketbase from 'pocketbase';

  const url = "https://immense-doctor.pockethost.io";
  const pb: Pocketbase = new Pocketbase(url);
  
  interface Props {
    showInput: {
      type: Boolean;
      required: true;
    };
  }

  const emits = defineEmits();
  
  const playlistName = ref('My Playlist');
  const errorMessage = ref('');
  
  const createPlaylist = async () => {
    try {
        if (playlistName.value.trim() === '') {
      errorMessage.value = 'Please enter a playlist name.';
      return;
    }

    errorMessage.value = '';
        console.log(`Creating playlist: ${playlistName.value}`);
    const data = {
        "name": playlistName.value
    }
    const record = await pb.collection('playlists').create(data);
    playlistName.value = '';
    console.log(record);
    emits('playlistCreated');
    } catch (e) {
        console.log(e);
    }
  };

  onMounted(async () => {
  try {
    const authData = await pb.admins.authWithPassword('gustavo.oliveira@exxess-markets.com', 'gpdo07062002');
    console.log(authData);
  } catch (e) {
    console.error(e);
  }
});
  
  </script>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      showInput: {
        type: Boolean as PropType<boolean>,
        required: true,
      },
    },
  });
  </script>
  