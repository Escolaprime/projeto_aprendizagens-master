<template>
  <div class="p-4">
    <main class="my-4 mx-auto">
      <section>
        <video
          v-if="convert"
          :ref="`video_off_${index}`"
          @play="set_element"
          :src="convert"
          type="video/mp4"
          controls
          class="rounded-t-xl w-full"
        ></video>
      </section>
      <section
        class="
          flex flex-row
          justify-between
          items-center
          px-4
          py-4
          bg-white
          shadow-lg
          rounded-b-xl
          dark:bg-gray-900
        "
      >
        <div class="space-y-4">
          <h2 class="font-medium text-xl text-gray-800 dark:text-gray-100">
            {{ option.titulo }}
          </h2>
          <h4 class="py-0 text-s text-gray-400 dark:text-gray-500">
            {{ option.descricao }}
          </h4>
          <div class="flex items-center">
            <h3 class="text-gray-500 dark:text-gray-200 font-medium">
              Professor(a) {{ option.professor }}
            </h3>
          </div>
        </div>
        <ion-fab horizontal="end" class="px-4">
          <ion-fab-button color="primary" size="small">
            <ion-icon name="chevron-down"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="start">
            <ion-fab-button
              @click="remover_video(option.uri, option.path)"
              color="light"
            >
              <ion-icon name="trash"></ion-icon>
            </ion-fab-button>
          </ion-fab-list>
        </ion-fab>
      </section>
    </main>
  </div>
</template>

<script>
import { IonFab, IonFabButton, IonFabList, IonIcon } from "@ionic/vue";
import { trash, chevronDown } from "ionicons/icons";
import { addIcons } from "ionicons";
addIcons({
  trash,
  "chevron-down": chevronDown,
});

import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";
import { mapGetters, mapActions } from "vuex";

const KEY_STORAGE = "offline";
export default {
  name: "Videocard",

  props: {
    option: {
      type: Object,
      required: true,
    },

    index: {
      type: Number,
      required: true,
    },
  },

  components: { IonFab, IonFabButton, IonFabList, IonIcon },

  data() {
    return {
      convert: null,
    };
  },

  computed: {
    ...mapGetters("autenticacao", ["get_user"]),
  },

  methods: {
    ...mapActions("helper", ["toast"]),

    set_element() {
      const element = this.$refs[`video_off_${this.index}`];
      this.$emit("currentplay", element);
    },

    convertURI() {
      let converted = Capacitor.convertFileSrc(this.option.uri);
      this.convert = converted;
    },

    async remover_video(uri, path) {
      await Filesystem.deleteFile({
        path: `${path}`,
        directory: Directory.External,
      }).then(async () => {
        this.toast("Video removido com sucesso");
        let { value: offline } = await Storage.get({ key: KEY_STORAGE });
        offline = JSON.parse(offline);


      for (var i = 0; i < offline.length; i++) {
        const { numero_matricula, semanas } = offline[i];

        if (numero_matricula === this.get_user.numero_matricula) {
          for (var s = 0; s < semanas.length; s++) {
            const { id: semana_id, dias } = semanas[s];
            
            for (var d = 0; d < dias.length; d++) {
              const { id: dia_id } = dias[d];
              
              if (dia_id == this.option.dia_id && semana_id == this.option.semana_id) {
                offline[i].semanas[s].dias[d].videos.splice(this.index, 1);
              }
            }
          }
        }
      }

        await Storage.set({
          key: KEY_STORAGE,
          value: JSON.stringify(offline),
        });
        this.$emit("remove-video", this.index);
      });
    },
  },

  async mounted() {
    this.convertURI();
  },
};
</script>