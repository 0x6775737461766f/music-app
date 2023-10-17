// store/index.ts

import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedSong: null,
    isPlaying: false,
    audio: null, // Referência ao objeto de áudio
  },
  mutations: {
    setSong(state, song) {
      state.selectedSong = song;
    },
    clearSong(state) {
      state.selectedSong = null;
      state.isPlaying = false;
      if (state.audio) {
        state.audio.pause();
        state.audio = null;
      }
    },
    setIsPlaying(state, isPlaying) {
      state.isPlaying = isPlaying;
    },
    setAudio(state, audio) {
      state.audio = audio;
    },
  },
  actions: {
    selectSong({ commit }, song) {
      commit('setSong', song);
    },
    clearSelectedSong({ commit }) {
      commit('clearSong');
    },
    setIsPlaying({ commit }, isPlaying) {
      commit('setIsPlaying', isPlaying);
    },
    setAudio({ commit }, audio) {
      commit('setAudio', audio);
    },
  },
  getters: {
    selectedSong: (state) => state.selectedSong,
    isPlaying: (state) => state.isPlaying,
    audio: (state) => state.audio,
  },
});

export default store;
