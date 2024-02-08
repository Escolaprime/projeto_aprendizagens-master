<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="modalDismiss">
            <ion-icon :icon="arrowBack" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ video.titulo }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" :fullscreen="true" color="dark">
      <player @watch="onWatch" :options="options" :stats="state.stats_video" />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  provide,
  reactive,
} from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonIcon,
  IonContent,
  IonProgressBar,
} from "@ionic/vue";
import { arrowBack } from "ionicons/icons";
import useDialogs from "@/composables/useDialogs";
import Player from "./Player.vue";
import { Capacitor } from "@capacitor/core";
import { useStore } from "vuex";
import { db as dexie } from "@/plugins/dexie";
import axios from "@/configs/axios.config";
export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonIcon,
    IonContent,
    IonProgressBar,
    Player,
  },
  props: {
    video: Object,
    videoOptions: Object,
  },
  data() {
    return {
      defaultOptions: {
        autoplay: false,
        controls: true,
        fluid: true,
        sources: [
          {
            src: "",
            type: "video/mp4",
          },
        ],
        html5: {
          hls: {
            overrideNative: true,
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        },
        controlBar: {
          volumePanel: false,
          progressControl: true,
          pictureInPictureToggle: false,
        },
      },
      stats: {},
    };
  },
  async created() {
    this.defaultOptions.sources = this.sources;
    // const exists = await dexie.table("stats_videos").get({
    //   video_id: this.$props.video.id,
    //   aluno_id: this.user.id,
    // });
    // this.stats = exists;
    // console.log(exists);
  },
  computed: {
    options() {
      return this.defaultOptions;
    },
    networkStatus() {
      return this.$store.state.helper.networkStatus;
    },
    user() {
      return this.$store.state.autenticacao.user;
    },
    sources() {
      const uri = Capacitor.convertFileSrc(this.$props.video.uri);
      const url = `${this.$store.state.helper.baseURL}/videos/streamingVideo/?hash=${this.$props.video.hash_video_id}`;
      return this.networkStatus.connected
        ? [{ src: url, type: "video/mp4" }]
        : [{ src: uri, type: "video/mp4" }];
    },
  },
  setup(props) {
    const store = useStore();
    const baseURL = store.state.helper.baseURL;
    const user = store.state.autenticacao.user;
    const { modalDismiss } = useDialogs();
    const state = reactive({
      progress: 0,
      stats_video: {},
    });
    const assistido = computed(() => state.stats_video?.completed);
    const networkStatus = store.state.helper.networkStatus;
    const uri = computed(() => Capacitor.convertFileSrc(props.video?.uri));
    const src = computed(
      () =>
        `${baseURL}/videos/streamingVideo/?hash=${props.video.hash_video_id}`
    );
    const defaultOptions = reactive({
      autoplay: false,
      controls: true,
      fluid: true,
      sources: [
        {
          src: networkStatus.connected ? src.value : uri.value,
          type: "video/mp4",
        },
      ],
      html5: {
        hls: {
          overrideNative: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
      controlBar: {
        volumePanel: false,
        progressControl: false,
        pictureInPictureToggle: false,
      },
      ...props.videoOptions,
    });
    const lastCurrentTime = ref(0);
    provide("lastCurrentTime", lastCurrentTime);
    const onWatch = ({ progress, currentTime }) => {
      state.progress = progress / 100;
      dexie
        .table("stats_videos")
        .get({
          video_id: props.video.id,
          aluno_id: user.id,
        })
        .then((video) => {
          if (currentTime > video.currentTime) {
            if (!video.completed) {
              dexie
                .table("stats_videos")
                .where({
                  video_id: props.video.id,
                  aluno_id: user.id,
                })
                .modify({
                  progress,
                  currentTime,
                  completed: progress === 100,
                })
                .then((video) => {
                  console.log("then");
                  lastCurrentTime.value = currentTime;
                });
            }
          }
        });

      // axios.patch("/stats/videosAlunos", {
      //   video_id: props.video.id,
      //   aluno_id: user.id,
      //   progress,
      //   currentTime,
      // });
      console.log("progress", progress + "%");
      console.log("currentTime", currentTime);
    };
    onMounted(async () => {
      const exists = await dexie.table("stats_videos").get({
        video_id: props.video.id,
        aluno_id: user.id,
      });
      console.log(exists);
      state.stats_video = exists;
      lastCurrentTime.value = exists?.currentTime ?? 0;
      if (!exists) {
        dexie.table("stats_videos").add({
          video_id: props.video.id,
          aluno_id: user.id,
          progress: 0,
          currentTime: 0,
          completed: false,
        });
        lastCurrentTime.value = 0;
        state.stats_video = {
          video_id: props.video.id,
          aluno_id: user.id,
          progress: 0,
          currentTime: 0,
          completed: false,
        };
      }
      axios.post("/stats/videosAlunos", {
        video_id: props.video.id,
        aluno_id: user.id,
        progress: 0,
        currentTime: 0,
      });
    });
    return {
      assistido,
      state,
      onWatch,
      arrowBack,
      modalDismiss,
    };
  },
});
</script>