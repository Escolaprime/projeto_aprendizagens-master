<template>
  <video ref="player" preload="metadata" />
</template>

<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  reactive,
  ref,
  toRef,
  inject,
  watch,
  watchEffect,
} from "vue";
import { db as dexie } from "@/plugins/dexie";
import { debounce } from "@/utils";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
export default defineComponent({
  props: {
    options: Object,
    stats: Object,
  },
  setup(props, { emit }) {
    const player = ref(null);
    let plyr;
    let timer;
    const lastCurrentTime = inject("lastCurrentTime");
    onMounted(() => {
      plyr = new Plyr(player.value, {
        debug: true,
        clickToPlay: true,
        hideControls: false,
        listeners: {
          seek: (ev) => {
            const getTargetTime = (plyr, input) => {
              return typeof input === "object" &&
                (input.type === "input" || input.type === "change")
                ? (input.target.value / input.target.max) * plyr.duration
                : Number(input);
            };
            const seeked = getTargetTime(plyr, ev);
            if (parseFloat(seeked) > lastCurrentTime.value) {
              ev.preventDefault();
              plyr.currentTime = lastCurrentTime.value;
              return false;
            }
          },
        },
        controls: ["play", "play-large", "progress", "duration", "fullscreen"],
      });
      plyr.on(
        "timeupdate",
        debounce(() => {
          emit("watch", {
            progress: Math.round((plyr.currentTime / plyr.duration) * 100),
            currentTime: plyr.currentTime,
          });
        }, 253)
      );
      plyr.source = {
        title: "Video teste",
        type: "video",
        sources: props.options.sources,
      };
    });
    onBeforeUnmount(() => {
      clearInterval(timer);
      plyr.destroy();
    });
    watchEffect(() => {
      console.log("lastCurrentTime", lastCurrentTime.value);
    });
    return {
      player,
    };
  },
  // setup(props, { emit, attrs }) {
  //   const state = reactive({
  //     progress: 0,
  //     currentTime: 0,
  //     isCompleted: false,
  //     video: {},
  //   });
  //   const video_stats = ref({});

  //   const playerInstance = ref(null);
  //   const player = ref();

  //   const onTimeupdate = debounce(async () => {
  //     if (state.isCompleted) return;
  //     state.currentTime = playerInstance.value.currentTime();
  //     if (state.progress <= 100) {
  //       const video = await dexie.table("stats_videos").get({
  //         video_id: props.stats.video_id,
  //         aluno_id: props.stats.aluno_id,
  //       });
  //       video_stats.value = video;
  //       const currentTime = playerInstance.value.currentTime();
  //       const duration = playerInstance.value.duration();
  //       state.progress = Math.round((currentTime / duration) * 100);
  //       emit("watch", {
  //         progress: state.progress,
  //         currentTime,
  //       });
  //     }
  //     state.isCompleted = state.progress === 100;
  //   }, 200);

  //   onMounted(() => {
  //     if (!props.stats.completed) {
  //       videojs.use("*", (player) => {
  //         return {
  //           setCurrentTime(ct) {
  //             console.log("video_stats", video_stats.value.currentTime);
  //             console.log("ct", ct);
  //             if (ct > video_stats.value.currentTime) {
  //               return video_stats.value.currentTime;
  //             }
  //             return ct;
  //           },
  //         };
  //       });
  //     }
  //     playerInstance.value = videojs(
  //       player.value,
  //       { ...props.options },
  //       (t) => {
  //         console.log("Videoplayer is ready");
  //         //playerInstance.value.controlBar.progressControl.disable();
  //       }
  //     );
  //   });
  //   onBeforeUnmount(() => {
  //     if (playerInstance.value) {
  //       playerInstance.value.dispose();
  //     }
  //   });
  //   onUnmounted(() => {
  //     console.log(player.value);
  //     if (playerInstance.value) {
  //       playerInstance.value.dispose();
  //     }
  //   });
  //   return {
  //     playerInstance,
  //     state,
  //     player,
  //     onTimeupdate,
  //     video_stats,
  //   };
  // },
});
</script>
