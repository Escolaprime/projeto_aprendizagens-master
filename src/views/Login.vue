<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full space-y-8">
          <div>
            <img
              class="mx-auto h-48 rounded w-auto"
              src="../assets/Logo_Projeto_Garanhuns.jpg"
              alt="Logo Somar"
            />
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              BEM-VINDO
            </h2>
            <p class="mt-2 text-center text-sm font-medium text-blue-600">
              Digite seu usuário e senha
            </p>
          </div>
          <div class="mt-8 space-y-6">
            <div class="">
              <div>
                <label for="email-address" class="sr-only">E-mail</label>
                <ion-item>
                  <ion-label position="floating">E-mail</ion-label>
                  <ion-input type="email" v-model="user.email"></ion-input>
                </ion-item>
              </div>
              <div>
                <label for="password" class="sr-only">Senha</label>
                <ion-item>
                  <ion-label position="floating">Senha</ion-label>
                  <ion-input
                    type="password"
                    @keyup.enter="autenticar"
                    v-model="user.password"
                  ></ion-input>
                </ion-item>
              </div>
            </div>

            <div class="flex items-center">
              <!-- <div class="text-sm">
                                <a href="#" class="font-medium text-blue-600">
                                    Esqueceu a senha ?
                                </a>
                            </div> -->
            </div>

            <div>
              <button
                @click="autenticar"
                class="
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
                "
              >
                Entrar
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
} from "@ionic/vue";
import axios from "@/configs/axios.config";

export default {
  name: "Login",
  components: { IonPage, IonContent, IonItem, IonInput, IonLabel },
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    async autenticar() {
      const loading = await loadingController.create({
        spinner: "bubbles",
        message: "Autenticando com o servidor",
        duration: 2500,
      });

      loading.present();

      axios
        .get("/autenticacao/loginAdmin", {
          headers: {
            ...this.user,
          },
        })
        .then(({ data }) => {
          loading.dismiss();

          const { mensagem } = data;
          this.$router.push({ path: "/Admin/aluno" });
        })
        .catch(({ response }) => {
          loading.dismiss();

          if (response) {
            const { mensagem } = response.data;

            this.toast(mensagem);
          }
        });
    },

    async toast(message) {
      const toast = await toastController.create({
        header: "Notificação",
        message,
        duration: 2000,
      });

      return toast.present();
    },
  },
};
</script>