<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/offline"></ion-back-button>
        </ion-buttons>
        <ion-title> Dias da {{ semana_titulo }} </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card button v-for="(item, index) in state.dias" :key="index" @click="streaming(item)">
        <ion-card-header class="flex flex-row items-center justify-between">
          <ion-card-title>{{ item.titulo }}</ion-card-title>
          <!-- <ion-label v-if="item.videos.length">
            <div class="flex flex-col items-center">
              {{ item.videos.length }}
              <span>Baixados</span>
            </div>
          </ion-label> -->
        </ion-card-header>
      </ion-card>
    </ion-content>
  </ion-page>
</template>



<script>
import { defineComponent, reactive } from "vue";
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
  IonCardTitle,
  IonLabel,
  IonBadge,
  IonIcon,
  onIonViewWillEnter,
} from "@ionic/vue";
import { addIcons } from "ionicons";
import { fileTray } from "ionicons/icons";
addIcons({
  "file-tray": fileTray,
});

import { useRoute } from "vue-router";
import { db as dexie } from "@/plugins/dexie";
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
    IonCardTitle,
    IonLabel,
    IonBadge,
    IonIcon,
  },
  data() {
    return {
      route: this.$route.query,
    };
  },
  setup() {
    const state = reactive({
      dias: [],
    });
    const route = useRoute();
    const { semana_titulo } = route.query;
    const getDias = async () => {
      return await dexie.table("dias").toArray();
    };

    onIonViewWillEnter(async () => {
      state.dias = await getDias();
    });
    return {
      state,
      semana_titulo,
    };
  },
  ionViewWillEnter() {
    return;
    if (this.$route.params.index_videos) {
      const index_videos = JSON.parse(this.$route.params.index_videos);

      console.log(index_videos);
      if (!index_videos.length > 0) return;

      index_videos.map((item) => {
        for (let i = 0; i < this.dias_off.length; i++) {
          const { id, videos } = this.dias_off[i];

          if (id == item.dia_id) {
            for (let v = 0; v < videos.length; v++) {
              const { video_id } = videos[v];
              if (video_id === item.video_id) {
                this.dias_off[i].videos.splice(item.index, 1);
              }
            }
          }
        }
      });
      return;
    }

    if (Object.keys(this.$route.params).length) {
      this.route = this.$route.params;
    }
  },
  methods: {
    streaming({ id: dia_id, titulo: dia_titulo }) {
      return this.$router.push({
        name: "StreamingOffline",
        query: {
          semana_id: parseInt(this.route.semana_id),
          dia_id,
          dia_titulo,
        },
      });
    },
  },
});
</script>
