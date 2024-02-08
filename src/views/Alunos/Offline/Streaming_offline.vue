<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-button size="large" shape="round" @click="voltar_pagina">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ dia_titulo }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ul class="grid gap-4 p-3">
        <li v-for="video in state.videos" :key="video.id">
          <article class="
                                                                                    bg-gradient-to-br
                                                                                    to-white
                                                                                    from-emerald-400
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

            <div class="
                                                                                      w-full
                                                                                      bg-gray-200
                                                                                      rounded-t-full
                                                                                      h-2.5
                                                                                      dark:bg-gray-700
                                                                                      hidden
                                                                                    ">
              <div class="bg-emerald-700 h-2.5 rounded-t-full" style="width: 100%"></div>
            </div>

            <section>
              <ul class="flex items-center divide-x dark:divide-[#4444]">
                <li class="flex-1">
                  <button class="bg-emerald-800 text-white block w-full p-2.5" @click="watchVideo(video)">
                    <ph-play class="mx-auto" :size="24" weight="fill" />
                  </button>
                </li>
                <li class="flex-1">
                  <button class="bg-rose-800 text-white block w-full p-2.5" @click="deleteVideo(video)">
                    <ph-trash class="mx-auto" :size="24" weight="fill" />
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
import Videocardoff from "@/components/Videocardoff";
import { useStore } from "vuex";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  onIonViewWillEnter,
} from "@ionic/vue";
import PlayerPage from "@/components/PlayerPage.vue";
import { PhPlay, PhTrash } from "phosphor-vue";
import { arrowBack } from "ionicons/icons";
import { computed, defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { db as dexie } from "@/plugins/dexie";
import useDialog from "@/composables/useDialogs";
import { Filesystem, Directory } from "@capacitor/filesystem"
export default defineComponent({
  name: "Streaming",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonBackButton,
    Videocardoff,
    IonIcon,
    PhPlay,
    PhTrash
  },
  setup() {
    const state = reactive({
      videos: [],
    });
    const store = useStore();
    const route = useRoute();
    const { modal, toast, alert } = useDialog();
    const user = computed(() => store.state.autenticacao.user);
    const { dia_titulo } = route.query;
    const getVideos = async () => {
      const { semana_id, dia_id } = route.query;
      const { etapa_id } = user.value;
      const params = {
        semana_id: Number(semana_id),
        dia_id: Number(dia_id),
        etapa_id,
      };
      const videos = await dexie
        .table("videos")
        .filter(({ etapa_id, semana_id, dia_id }) => {
          return (
            etapa_id === params.etapa_id &&
            semana_id === params.semana_id &&
            dia_id === params.dia_id
          );
        })
        .toArray();
      state.videos = videos;
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
    };
    const deleteVideo = async (video) => {
      alert({
        header: 'Atenção',
        message: "Você deseja excluir este vídeo ?",
        buttons: [
          {
            text: 'SIM',
            handler: async () => {
              const rgx = /DA_VIDEO_\w+.mp4/
              const path = rgx.exec(video.uri)[0]
              try {
                await dexie.table('videos').where("id").equals(video.id).delete()
                await Filesystem.deleteFile({
                  path,
                  directory: Directory.External
                })
                getVideos()
                toast({ message: 'Video deletado com sucesso', duration: 2000 }).then(el => el.present())
              } catch (error) {
                console.log(error)
                toast({ message: "Error ao deletar vídeo", duration: 2000 }).then(el => el.present())
              }
            }
          },
          {
            text: "NÃO"
          }
        ]
      }).then(el => el.present())
    }
    onIonViewWillEnter(async () => {
      await getVideos();
    });
    return {
      state,
      dia_titulo,
      arrowBack,
      watchVideo,
      deleteVideo
    };
  },
  data() {
    return {
      //route: this.$route.params,
      //videos: JSON.parse(this.$route.params.videos),
      //element: null,
      //index_videos: [],
    };
  },
  // ionViewDidLeave() {
  //   this.videos = [];
  // },
  // ionViewWillLeave() {
  //   if (this.element) {
  //     this.element.pause();
  //   }
  // },
  // ionViewWillEnter() {
  //   this.route = this.$route.params;
  //   this.videos = JSON.parse(this.$route.params.videos);
  // },
  // computed: {
  //   ...mapGetters("autenticacao", ["get_user"]),

  //   videos_off() {
  //     if (this.route.videos.length) return JSON.parse(this.route.videos) || [];

  //     return [];
  //   },
  // },
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

    voltar_pagina() {
      this.$router.replace({
        name: "DiasOffline",
        query: { index_videos: JSON.stringify(this.index_videos) },
      });
    },

    remover_video(index, { video_id, dia_id }) {
      this.index_videos.push({ index, dia_id, video_id });
      this.videos.splice(index, 1);
    },
  },
});
</script>
<style scoped>
ion-icon {
  width: 24px;
  height: 24px;
}
</style>