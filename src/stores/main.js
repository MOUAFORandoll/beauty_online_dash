import { defineStore } from "pinia"; 
import axios from "axios";
export const useMainStore = defineStore("main", {
  state: () => ({
    nom: null,
    email: null,
    phone: null,
    keySecret: null,
    userAvatar: null,
    token: null,
    refreshToken: null, // Ajout de la propriété pour la durée de vie du token

    isFieldFocusRegistered: false,

    clients: [],
    history: [],
    listAgregator: [],
    listProjet: [],
    listLivraisons: [],
  }),
  actions: {
    setListAgregator(data) {
      this.listAgregator = data;
    },
    setListProjet(data) {
      this.listProjet = data;
    },
    setListLivraisons(data) {
      this.listLivraisons = data;
    },
    setUser(data) {
     
    },
    clear() {
      this.nom = null;
      this.email = null;
      this.token = null;
      this.phone = null;
      this.keySecret = null;
      this.token = null;
      this.refreshToken = null;
      localStorage.clear();
    },
    onCreated() {
    
    },
    setToken(token, refreshToken) {
      this.token = token;
      this.refreshToken = refreshToken;
    },
    isTokenValid() {
      if (this.token && this.refreshToken) {
        const now = new Date();
        const expirationDate = new Date(this.refreshToken);
        return now < expirationDate;
      }
      return false;
    },
    fetch(sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data;
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
});
