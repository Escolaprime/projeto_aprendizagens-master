<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet, alertController } from "@ionic/vue";
import { App } from "@capacitor/app";
import { defineComponent } from "vue";
import {
  requestPermissionNotifications,
  requestPermissionFilesystem,
} from "@/permissions/permissions";
import { mapActions } from "vuex";
import "@/version/version";
import { Storage } from "@capacitor/storage";

const KEY_STORAGE = "offline";

export default defineComponent({
  name: "App",

  data() {
    return {
      doubleClick: 0,
    };
  },

  async created() {
    await requestPermissionNotifications();
    await requestPermissionFilesystem();
    this.checar_storage_offline();
  },

  methods: {
    ...mapActions("video", ["obter_semanas", "obter_dias"]),
    async alertExit() {
      const alert = await alertController.create({
        message: "Deseja sair do aplicativo ?",
        buttons: [
          {
            text: "Não",
            role: "Cancel",
            handler: () => {
              this.doubleClick = 0;
            },
          },
          {
            text: "Sim",
            handler: () => {
              App.exitApp();
            },
          },
        ],
      });

      return alert.present();
    },

    async checar_storage_offline() {
      const { value } = await Storage.get({ key: KEY_STORAGE });

      const offline = JSON.parse(value);

      if (!offline) {
        console.log("não existe");
        return;
      }

      const offline_antigo = offline.filter((item) => item.dias);

      if (offline_antigo.length) {
        await Storage.set({ key: KEY_STORAGE, value: JSON.stringify([]) });
        console.log("Offline atualizado");
        return;
      }
    },
  },
  mounted() {
    document.addEventListener("ionBackButton", (ev) => {
      ev.detail.register(5, () => {
        this.doubleClick++;

        if (this.doubleClick >= 2) {
          this.alertExit();
        }
      });
    });
  },
  components: {
    IonApp,
    IonRouterOutlet,
  },
});
</script>

<style>
img,
video {
  max-width: 100%;
  max-height: 100%;
}
</style>