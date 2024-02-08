<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="close_modal">
          <ion-icon name="close"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ video_name }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item
        v-for="(link, index) in links"
        :key="index"
        detail
        button
        :href="link.link"
        target="_blank"
      >
        <svg xmlns="http://www.w3.org/2000/svg" slot="start" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <ion-label>{{ link.titulo }}</ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  modalController,
} from "@ionic/vue";
import { close, logoYoutube, documentText } from "ionicons/icons";
import { addIcons } from "ionicons";
addIcons({ close, "logo-youtube": logoYoutube, "document-text": documentText });
export default defineComponent({
  name: "ModaLinks",
  props: {
    video_name: {
      type: String,
    },

    links: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
  },
  methods: {
    close_modal() {
      modalController.dismiss();
    },
    check_link(link) {
      return link.toLowerCase().search("youtube") > -1;
    },
  },
});
</script>