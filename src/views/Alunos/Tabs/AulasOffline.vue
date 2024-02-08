<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
        <ion-title> Conteúdos baixados </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Aulas baixadas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card button v-for="(item, index) in semanas_offline" @click="streaming_offline(item, index)" :key="item.id">
        <ion-card-header>
          <ion-card-title>{{ item.titulo }}</ion-card-title>
        </ion-card-header>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";

import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import { db as dexie } from "@/plugins/dexie";

export default defineComponent({
  name: "AulasOffline",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardTitle,
  },

  data() {
    return {
      semanas_offline: [],
    };
  },
  async ionViewWillEnter() {
    const semanas = await dexie.table("semanas").toArray();
    this.semanas_offline = semanas;
  },
  computed: {
    ...mapGetters("autenticacao", ["get_user"]),
  },
  methods: {
    streaming_offline({ id: semana_id, titulo: semana_titulo, dias }) {
      this.$router.push({
        name: "DiasOffline",
        query: {
          semana_id,
          semana_titulo,
          etapa_id: this.get_user.etapa_id,
          escola_id: this.get_user.escola_id,
        },
      });
    },
  },
});
</script>