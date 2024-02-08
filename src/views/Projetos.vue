<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title> Escolha um projeto </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="flex flex-col gap-5 items-center justify-center py-12">
        <ul class="px-10 space-y-6 flex-1">
          <li
            class="flex flex-col items-center"
            v-for="projeto in projetos"
            :key="projeto.id"
            @click="onSelectProjeto(projeto)"
          >
            <img :alt="projeto.nome" :src="projeto.image" />
          </li>
        </ul>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonThumbnail,
  useIonRouter,
} from "@ionic/vue";
import useStorage from "@/composables/useStorage";
export default defineComponent({
  name: "Projetos",
  components: {
    IonPage,
    IonContent,
    IonImg,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonThumbnail,
  },
  setup() {
    const storage = useStorage();
    const router = useIonRouter();
    const projetos = ref([
      {
        id: 1,
        nome: "Projeto Aprendizagens",
        image: require("@/assets/projetos/projeto-aprendizagens.jpeg"),
      },
      {
        id: 2,
        nome: "Projeto Igaci",
        image: require("@/assets/projetos/projeto-igaci.jpeg"),
      },
      {
        id: 2,
        nome: "Projeto Nivelar",
        image: require("@/assets/projetos/projeto-nivelar.jpeg"),
      },
    ]);
    const onSelectProjeto = (projeto) => {
      console.log(projeto);
      storage.setAsJsonStorage("projeto", projeto);
      router.push("/LoginAluno");
    };
    return {
      onSelectProjeto,
      projetos,
    };
  },
});
</script>

<style scoped>
ion-thumbnail {
  --size: 140px;
}
</style>