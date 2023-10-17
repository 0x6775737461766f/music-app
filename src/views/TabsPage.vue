<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar class="custom-tab-bar">
        <ion-tab-button tab="tab1" href="/tabs/tab1" class="custom-tab-button">
          <ion-icon aria-hidden="true" :icon="musicalNoteOutline" class="text-3xl mb-2"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2" class="custom-tab-button">
          <ion-icon aria-hidden="true" :icon="searchOutline" class="text-3xl mb-2"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3" class="custom-tab-button">
          <ion-icon aria-hidden="true" :icon="personOutline" class="text-3xl mb-2"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style scoped>
.custom-tab-bar {
  background-color: rgba(51, 51, 51, 0.8); /* Cor de fundo com opacidade */
  backdrop-filter: blur(5px); /* Adicionando um leve desfoque */
}

.custom-tab-button {
  color: #fff; /* Cor dos ícones das tabs */
  background-color: #000; /* Cor de fundo preta (full black) */
  opacity: 0.9; /* Reduzindo a opacidade dos botões */
}

/* Adicione mais estilos conforme necessário */
</style>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { musicalNoteOutline, searchOutline, personOutline } from 'ionicons/icons';
</script>
