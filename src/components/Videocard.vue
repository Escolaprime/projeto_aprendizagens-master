<template>
  <div class="p-4">
    <main class="my-4 mx-auto">
      <section>
        <video :ref="`video_${index}`" @play="set_element(index)" controls class="rounded-t-xl w-full">
          <source :src="`${get_baseURL}/videos/streamingVideo/?hash=${option.hash_video_id}`" type="video/mp4" />
        </video>
      </section>
      <section class="
            flex flex-row
            justify-between
            items-center
            px-4
            py-4
            bg-white
            shadow-lg
            rounded-b-xl
            dark:bg-gray-900
          ">
        <div class="space-y-4">
          <h2 class="font-medium text-xl text-gray-800 dark:text-gray-100">
            {{ option.titulo }}
          </h2>
          <h4 class="py-0 text-sm text-gray-400 dark:text-gray-500">
            {{ option.descricao }}
          </h4>
          <div class="flex items-center" v-if="!option.ajuda">
            <h3 class="text-gray-500 dark:text-gray-200 font-medium">
              Professor(a) {{ option.professor }}
            </h3>
          </div>
        </div>
        <ion-fab horizontal="end" class="px-4" v-if="!option.ajuda">
          <ion-fab-button color="primary" size="small">
            <ion-icon name="chevron-down"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="start">
            <ion-fab-button @click="saveVideo(option.id, option.hash_video_id)" color="light">
              <ion-icon name="cloud-download"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="light" @click="show_modal_links">
              <ion-icon name="link"></ion-icon>
            </ion-fab-button>
          </ion-fab-list>
        </ion-fab>
      </section>
    </main>
  </div>
</template>

<script>
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  modalController,
  toastController,
} from "@ionic/vue";
import { cloudDownload, chevronDown, documentText, link } from "ionicons/icons";
import { addIcons } from "ionicons";
addIcons({
  "cloud-download": cloudDownload,
  "chevron-down": chevronDown,
  "document-text": documentText,
  link,
});

import axios from "@/configs/axios.config";
import { Capacitor } from "@capacitor/core";
import { mapGetters } from "vuex";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Directory } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";
import * as blobWriter from "capacitor-blob-writer";

const KEY_STORAGE = "offline";
import { defineComponent } from "vue";

import ModalLinks from "./ModalLinks.vue";
export default defineComponent({
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
  data() {
    return {
      percent: 0,
    };
  },
  components: { IonFab, IonFabButton, IonFabList, IonIcon },
  computed: {
    ...mapGetters("autenticacao", ["get_user"]),
    ...mapGetters("helper", ["get_baseURL"]),
  },
  methods: {
    async show_modal_links() {
      const { titulo, links } = this.option;

      const modal = await modalController.create({
        component: ModalLinks,
        cssClass: "my-custom-modal-css",
        componentProps: {
          video_name: titulo,
          links,
        },
        mode: "md",
        swipeToClose: true,
      });

      return modal.present();
    },

    set_element(index) {
      const element = this.$refs[`video_${index}`];
      this.$emit("currentplay", element);
    },

    async getVideo(hash_video_id) {
      try {
        this.$emit("download", {
          isDownload: true,
          message: "Baixando videoaula",
        });

        const { data } = await axios.get("/videos/downloadVideo", {
          params: { hash_video_id },
          responseType: "blob",
        });

        this.$emit("download", { isDownload: false, message: null });
        return data;
      } catch (error) {
        return new Error(error.toString());
      }
    },

    async saveVideo(id, hash_video_id) {
      const blob = await this.getVideo(hash_video_id);

      this.$emit("savevideo", { isSave: true, message: "Gravando videoaula" });

      const timestamp = new Date().getTime();
      const name_file = `DA_VID_${timestamp}.mp4`;
      await this.save_mobile_video(name_file, blob, id);
    },

    async save_mobile_video(path, blob, id) {
      console.time("Blob_WRITER");
      await blobWriter({
        path,
        directory: Directory.External,
        data: blob,
        recursive: true,
      })
        .then(async (uri) => {
          console.timeEnd("Blob_WRITER");
          this.$emit("savevideo", { isSave: false, message: null });
          await this.storageOffline(id.toString(), uri, path);
          await this.notification();
        })
        .catch(async (err) => {
          this.$emit("savevideo", { isSave: false, message: null });
          const toast = await toastController.create({
            message: "Error ao gravar video.",
            duration: 3000,
          });
          console.log(err);
          return toast.present();
        });
    },

    async notification() {
      const { titulo, professor } = this.option;
      await LocalNotifications.schedule({
        notifications: [
          {
            id: new Date().getTime(),
            title: "Video salvo",
            body: `O video ${titulo}, do professor ${professor} está disponivel em offline.`,
          },
        ],
      });
    },

    async storageOffline(video_id, uri, path) {
      let { value: offline } = await Storage.get({ key: KEY_STORAGE });

      offline = JSON.parse(offline);

      for (var i = 0; i < offline.length; i++) {
        const { numero_matricula, semanas } = offline[i];

        if (numero_matricula === this.get_user.numero_matricula) {
          for (var s = 0; s < semanas.length; s++) {
            const { dias, id: semana_id } = semanas[s];

            for (var d = 0; d < dias.length; d++) {
              const { id: dia_id } = dias[d];

              if (
                dia_id == this.option.dia_id &&
                semana_id == this.option.semana_id
              ) {
                offline[i].semanas[s].dias[d].videos.push({
                  video_id,
                  semana_id: this.option.semana_id,
                  dia_id: this.option.dia_id,
                  titulo: this.option.titulo,
                  descricao: this.option.descricao,
                  professor: this.option.professor,
                  uri,
                  path,
                });
              }
            }
          }
        }
      }
      await Storage.set({ key: KEY_STORAGE, value: JSON.stringify(offline) });
    },
  },
});
</script>

<style>
.my-custom-modal-css .modal-wrapper {
  height: 80%;
  top: 20%;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  position: absolute;
  display: block;
}
</style>