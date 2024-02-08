<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full space-y-8">
          <div>
            <img class="mx-auto h-48 rounded w-auto" src="../../assets/logo-escola-prime.jpeg" alt="escola prime+" />
            <h2 class="
                    mt-6
                    text-center text-3xl
                    font-extrabold
                    text-gray-900
                  ">
              BEM-VINDO
            </h2>
            <p class="mt-2 text-center text-sm font-medium text-blue-600">
              Você está no projeto
              <span class="text-base font-bold">{{ projeto.nome }}</span>
            </p>
          </div>
          <div class="mt-8 space-y-6">
            <div class="">
              <div>
                <ion-item>
                  <ion-label position="floating">Digite o número da matrícula</ion-label>
                  <ion-input type="text" v-model="numero_matricula" @keyup.enter="login" enterkeyhint="done"></ion-input>
                </ion-item>
              </div>
            </div>

            <div class="flex items-center">
              <div class="flex flex-row gap-2 text-sm" v-if="get_numero_suporte != null">
                <ion-icon name="logo-whatsapp" size="small" class="text-blue-600"></ion-icon>
                <button class="font-medium text-blue-600" @click="suporte">
                  Fale conosco
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <button @click="login" class="
                      w-full
                      flex
                      justify-center
                      py-2
                      px-4
                      border border-transparent
                      text-sm
                      font-medium
                      rounded-md
                      text-white
                      bg-blue-600
                      hover:bg-blue-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-offset-2
                      focus:ring-blue-500
                    ">
                Entrar
              </button>
              <button @click="changeProjeto" class="
                      w-full
                      flex
                      justify-center
                      py-2
                      px-4
                      border border-transparent
                      text-sm
                      font-medium
                      rounded-md
                      text-blue-600
                      bg-white
                      dark:bg-gray-100
                      dark:hover:bg-gray-300
                      hover:bg-gray-100
                      focus:outline-none
                      focus:ring-2
                      focus:ring-offset-2
                      focus:ring-blue-500
                    ">
                Mudar de projeto
              </button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  loadingController,
  toastController,
  IonIcon,
} from "@ionic/vue";
import { SocialSharing } from "@ionic-native/social-sharing";
import { logoWhatsapp } from "ionicons/icons";
import { addIcons } from "ionicons";
addIcons({
  "logo-whatsapp": logoWhatsapp,
});
import { mapActions, mapGetters } from "vuex";
import { defineComponent } from "vue";
import useStorage from "@/composables/useStorage";
export default defineComponent({
  name: "Login",
  components: { IonPage, IonContent, IonItem, IonInput, IonLabel, IonIcon },

  data() {
    return {
      numero_matricula: null,
      projeto: {},
    };
  },

  ionViewWillLeave() {
    this.numero_matricula = null;
  },
  ionViewWillEnter() {
    this.getProjeto();
  },
  computed: {
    ...mapGetters("helper", ["get_numero_suporte"]),
  },
  mounted() {
    this.pre_login();
    this.getProjeto();
  },
  methods: {
    ...mapActions("autenticacao", ["login_aluno"]),
    ...mapActions("helper", ["pre_login"]),
    async getProjeto() {
      const storage = useStorage();
      this.projeto = await storage.getAsJsonStorage("projeto");
    },
    async changeProjeto() {
      const storage = useStorage();
      await storage.deleteStorage("projeto");
      this.$router.push("/");
    },
    async login() {
      const loading = await loadingController.create({
        spinner: "bubbles",
        message: "Autenticando",
        duration: 2500,
      });
      await loading.present();

      try {
        await this.login_aluno(this.numero_matricula);
        loading.dismiss();
        this.$router.push({ path: "/tabs/" });
      } catch (error) {
        if (error.response) {
          loading.dismiss();
          const { mensagem = null, message = null } = error.response.data;
          console.log(error);
          console.log(error.response);
          const toast = await toastController.create({
            message: mensagem || message || "Error",
            duration: 2000,
          });
          return toast.present();
        }
      }
    },

    suporte() {
      const message = `Bem-vindo ao suporte. Relate o problema abaixo:\n`;
      SocialSharing.shareViaWhatsAppToPhone(this.get_numero_suporte, message)
        .then(() => { })
        .catch((err) => {
          const element = document.createElement("a");
          const formated = message.replaceAll(/\n/g, "%0D");
          element.href = `https://wa.me/${this.get_numero_suporte}/?text=${formated}`;
          element.target = "_blank";
          element.click();
        });
    },
  },
});
</script>