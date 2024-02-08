<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Ajuda</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <videocard
        v-for="(video, index) in videos"
        :key="index"
        :index="index"
        :option="video"
        @currentplay="set_element"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
} from "@ionic/vue";
import Videocard from "@/components/Videocard.vue";

import { defineComponent } from "vue";
import axios from "@/configs/axios.config";

export default defineComponent({
  name: "Ajuda",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    Videocard,
  },
  data() {
    return {
      videos: [],
      element: null
    };
  },
  ionViewWillEnter() {
    this.obter_videos_ajuda();
  },
  methods: {

    set_element(el) {
      if (this.element === el) {
        this.element.play();
        return;
      } else {
        if (this.element) {
          this.element.pause();
        }

        this.element = el;
        this.element.play();
      }
    },
    obter_videos_ajuda() {
      axios
        .get("/videos/obterVideosAjuda")
        .then(({ data }) => {
          this.videos = data;
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
  },
});
</script>