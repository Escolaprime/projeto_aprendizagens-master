<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ params.dia_titulo }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ul class="grid gap-4 p-3">
        <li v-for="video in state.videos" :key="video.id">
          <article class="
            bg-gradient-to-br
            to-white
            from-indigo-400
            dark:bg-[#3333]
            shadow
            rounded-xl
            overflow-hidden
          ">
            <header class="p-4">
              <h1 class="text-xl font-bold mb-4">{{ video.titulo }}</h1>
              <h3 class="text-base font-normal mb-2">
                Professor <br />
                <span class="font-semibold">{{ video.professor }}</span>
              </h3>
              <p class="text-sm font-normal text-gray-900">
                {{ video.descricao }}
              </p>
            </header>

            <section>
              <ul class="flex items-center">
                <li class="w-1/4">
                  <button @click="openLink(video)" class="bg-amber-400 text-gray-900 block w-full p-2.5">
                    <ph-link-simple class="mx-auto" />
                  </button>
                </li>
                <li class="w-1/4">
                  <button @click="downloadVideo(video)" class="bg-amber-500 text-gray-900 block w-full p-2.5">
                    <ph-file-arrow-down class="mx-auto" />
                  </button>
                </li>
                <li class="flex-1">
                  <button class="bg-indigo-600 text-white block w-full p-2.5" @click="watchVideo(video)">
                    <ph-play class="mx-auto" weight="fill" />
                  </button>
                </li>
              </ul>
            </section>
          </article>
        </li>
      </ul>
    </ion-content>
  </ion-page>
</template>

<script>
import Videocard from "@/components/Videocard";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonProgressBar,
  onIonViewWillEnter,
} from "@ionic/vue";
import { PhLinkSimple, PhFileArrowDown, PhPlay } from "phosphor-vue";
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import useBlobWriter from "@/composables/useBlobWriter";
import useDialogs from "@/composables/useDialogs";
import axios from "@/configs/axios.config";
import PlayerPage from "@/components/PlayerPage.vue";
import useStorage from "@/composables/useStorage";
import { db as dexie } from "@/plugins/dexie";
import { useStore } from "vuex";
export default defineComponent({
  name: "Streaming",

  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonProgressBar,
    Videocard,
    PhLinkSimple,
    PhFileArrowDown,
    PhPlay,
  },
  provide: {
    size: 24,
    mirrored: false,
  },
  setup() {
    const store = useStore()
    const user = store.state.autenticacao.user
    const { loading, toast, modal } = useDialogs();
    const { writerFile } = useBlobWriter();
    const { getAsJsonStorage } = useStorage();
    const route = useRoute();
    const state = reactive({
      videos: [],
    });
    const updateStats = async () => {
      const videos = await dexie.table("stats_videos").toArray();
      const videosFiltered = videos.filter((video) => video.progress <= 100)
      if (videosFiltered.length) {
        await axios.patch("/stats/videosAlunos", videosFiltered);
      }
    }
    onIonViewWillEnter(() => {
      updateStats()
      getVideos();
    });
    // onIonViewDidLeave(() => {
    //   clearInterval(timer);
    // });
    // onBeforeUnmount(() => {
    //   clearInterval(timer);
    // });
    const saveOfflineVideo = async (uri, video, path) => {
      const exists = await dexie.table("videos").get({ id: video.id });
      if (!exists) {
        await dexie.table("videos").add({
          ...video,
          links: null,
          uri,
          path
        });
      }
    };
    const watchVideo = async (video) => {
      const el = await modal({
        component: PlayerPage,
        componentProps: {
          video,
          videoOptions: {},
        },
      });

      el.present();
      el.onWillDismiss().then(() => {
        updateStats()
      })
    };
    const openLink = (video) => {
      const el = document.createElement("a");
      el.href = video.form;
      el.target = "_blank";
      axios.put(`/videos/contagem`, { video_id: video.id, aluno_id: user.id, form: video.form }).catch((error) => {
        console.log(error)
      }).finally(() => {
        el.click();
      })
    };
    const downloadVideo = async (video) => {
      const exists = await dexie.table("videos").get({ id: video.id });

      if (exists) {
        return toast({
          message: "Este video já esta disponivel offline",
          duration: 2500,
        }).then((t) => t.present());
      }
      const el = await loading({ message: "Baixando o video" });
      el.present();
      try {
        const blob = await getBlobVideo(video);
        console.log(blob)
        el.message = "Salvando o video";
        const path = `DA_VIDEO_${Date.now()}.mp4`;
        writerFile({ path, blob })
          .then(async (uri) => {
            saveOfflineVideo(uri, video, path);
            toast({ message: "Video salvo com sucesso", duration: 2000 }).then(
              (el) => el.present()
            );
          })
          .catch((err) => {
            console.error(err);
            toast({ message: "Error ao salvar video", duration: 2000 }).then((el) => el.present());
          })
          .finally(() => el.dismiss());
      } catch (error) {
        el.dismiss()
        toast({ message: "Erro ao baixar video", duration: 2000 }).then(el => el.present())
      }

    };
    const getBlobVideo = async (video) => {
      const { hash_video_id } = video;
      const { data } = await axios.get("/videos/downloadVideo", {
        params: { hash_video_id },
        responseType: "blob",
      });
      return data;
    };
    const getVideos = async () => {
      const { etapa_id, escola_id, dia_id, semana_id } = route.query;
      console.log(route.query)
      const { data } = await axios.get("/videos/obterVideo", {
        params: {
          etapa_id: etapa_id,
          escola_id: escola_id,
          dia_id: dia_id,
          semana_id: semana_id,
        },
      });
      console.log(data);
      state.videos = data;
    };
    return {
      state,
      params: route.query,
      downloadVideo,
      getBlobVideo,
      openLink,
      watchVideo,
    };
  },
});
</script>