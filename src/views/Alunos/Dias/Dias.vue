<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Dias da {{ route.semana_titulo }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card button v-for="(item, index) in get_dias" :key="index" @click="streaming(item)">
        <ion-card-header>
          <ion-card-title>{{ item.titulo }}</ion-card-title>
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
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle

} from "@ionic/vue";
import { mapActions, mapGetters } from 'vuex';
export default defineComponent({
  name: "Dias",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle

  },
  data() {
    return {
      route: this.$route.query
    }
  },
  created() {
    this.obter_dias();
  },
  ionViewWillEnter() {
    if (Object.keys(this.$route.query).length) {

      this.route = this.$route.query;
    }
  },
  computed: {
    ...mapGetters('video', ['get_dias']),
    ...mapGetters('autenticacao', ['get_user'])
  },
  methods: {
    ...mapActions('video', ['obter_dias']),

    streaming({ id: dia_id, titulo: dia_titulo }) {
      return this.$router.push({
        name: "Streaming",
        query: {
          semana_id: this.route.semana_id,
          dia_id,
          etapa_id: this.get_user.etapa_id,
          escola_id: this.get_user.escola_id,
          dia_titulo
        }
      })
    }
  }
});
</script>
