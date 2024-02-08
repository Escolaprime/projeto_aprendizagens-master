<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Semanas</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content> 
        <ion-card button @click="$router.push({ name: 'Dias' })">
          <ion-card-header>
            <ion-card-title>Semana 1</ion-card-title>
          </ion-card-header>
        </ion-card>
    </ion-content>
  </ion-page>
</template>



<script>
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from "@ionic/vue";
export default defineComponent({
  name: "Semanas",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
  },
});
</script>
