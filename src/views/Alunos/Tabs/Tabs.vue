<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button
          :disabled="!networkStatus.connected"
          tab="etapas"
          href="/tabs/etapas"
        >
          <ion-icon icon="videocam" />
          <ion-label>Videoaulas</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="offline"
          style="--color-selected: #2dd36f"
          href="/tabs/offline"
        >
          <ion-icon icon="cloud-download" />
          <ion-label>Aulas baixadas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="perfil" href="/tabs/perfil">
          <ion-icon icon="person" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>

        <ion-tab-button @click="$router.replace({ name: 'index' })">
          <ion-icon icon="logout" />
          <ion-label>Sair</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import {
  library,
  cloudDownload,
  logOut,
  person,
  videocam,
} from "ionicons/icons";
import { addIcons } from "ionicons";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
addIcons({
  library,
  "cloud-download": cloudDownload,
  logout: logOut,
  person,
  videocam,
});
export default {
  name: "Tabs",
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    const store = useStore();
    return {
      networkStatus: computed(() => store.state.helper.networkStatus),
    };
  },
};
</script>