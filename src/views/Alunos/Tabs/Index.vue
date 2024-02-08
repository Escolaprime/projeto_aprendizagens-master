<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Etapa {{ titulo }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Etapas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card button @click="Dias(item)" v-for="(item, index) in get_semanas" :key="index">
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
import axios from "@/configs/axios.config";
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { Storage } from "@capacitor/storage";
import { Network } from "@capacitor/network";
import db from "@/plugins/db";
import { db as dexie } from "@/plugins/dexie";
const KEY_STORAGE = "offline";
export default defineComponent({
  name: "Index",

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
      arrEtapas: [],
      titulo: "",
    };
  },
  ionViewWillEnter() {
    this.obterEtapa();
    this.obter_semanas();
    this.obter_dias();
  },
  created() {
    const status = this.$store.state.helper.networkStatus;
    if (!status.connected) {
      return this.$router.push("/tabs/offline");
    }
  },
  computed: {
    ...mapGetters("autenticacao", ["get_user"]),
    ...mapGetters("video", ["get_semanas", "get_dias"]),
  },
  methods: {
    ...mapActions("video", ["obter_semanas", "obter_dias"]),

    Dias({ id, titulo }) {
      return this.$router.push({
        name: "Dias",
        query: {
          semana_id: id,
          semana_titulo: titulo,
        },
      });
    },
    async obterEtapa() {
      const { connected } = await Network.getStatus();

      if (connected) {
        await axios
          .get("/etapas/obterEtapa", {
            params: {
              etapa_id: this.get_user.etapa_id,
            },
          })
          .then(async ({ data }) => {
            this.arrEtapas = data;
            this.titulo = data[0].titulo;
            await this.verificarStorage(data);
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            }
          });
        return;
      }

      let { value } = await Storage.get({ key: KEY_STORAGE });

      if (!value) {
        return console.log("Não existe lista de alunos offline");
      }
      value = JSON.parse(value);
      this.arrEtapas = value.filter(
        (item) => item.numero_matricula === this.get_user.numero_matricula
      );
    },

    async verificarStorage(data) {
      let { value } = await Storage.get({ key: KEY_STORAGE });
      value = JSON.parse(value);
      this.get_dias.map((item, index) => {
        this.get_dias[index].videos = [];
      });

      this.get_semanas.map((_, index) => {
        this.get_semanas[index].dias = this.get_dias;
      });

      const [etapa] = data;

      let offline = {
        numero_matricula: this.get_user.numero_matricula,
        aluno_id: this.get_user.id,
        semanas: this.get_semanas,
      };
      const aluno = await dexie
        .table("alunos")
        .get({ aluno_id: this.get_user.id });

      if (!aluno) {
        await dexie.table("alunos").add({
          numero_matricula: this.get_user.numero_matricula,
          aluno_id: this.get_user.id,
          ...data[0],
        });
      }
      Object.keys(etapa).map((key) => {
        offline[key] = etapa[key];
      });
      if (!value) {
        return console.log("Não existe lista de alunos offline");
      }

      const exists = value.filter(
        (item) => item.numero_matricula === this.get_user.numero_matricula
      );

      if (exists.length) {
        const { semanas: semanas_offline } = value.filter(
          (item) => item.numero_matricula === this.get_user.numero_matricula
        )[0];

        //const sem_ids = this.get_semanas.map((semana_online) => semana_online.id);
        const sem_off_id = semanas_offline.map((sem) => sem.id);
        const semanas_nova = this.get_semanas.filter(
          (item) => !sem_off_id.includes(item.id)
        );
        semanas_nova.map((item) => {
          exists[0].semanas.push(item);
        });
        this.atualizar_storage_offline(offline, value, exists);
        return;
      }

      value.push(offline);

      await Storage.set({
        key: KEY_STORAGE,
        value: JSON.stringify(value),
      });
    },

    async atualizar_storage_offline(offline, oldArray, exists) {
      const [{ numero_matricula, semanas }] = exists;
      const index = oldArray
        .map((item) => item.numero_matricula)
        .indexOf(numero_matricula);

      oldArray.splice(index, 1, { ...offline, numero_matricula, semanas });

      await Storage.remove({
        key: KEY_STORAGE,
      });

      await Storage.set({
        key: KEY_STORAGE,
        value: JSON.stringify(oldArray),
      });
    },
  },
});
</script>