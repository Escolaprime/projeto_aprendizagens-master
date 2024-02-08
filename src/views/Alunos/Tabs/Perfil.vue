<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="$router.push({ name: 'ajuda' })">
            Ajuda
            <ion-icon size="large" name="help-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-item lines="none">
            <div class="flex flex-col space-y-4">
              <div class="flex flex-col-reverse">
                <label class="text">Aluno</label>
                <span class="text-lg font-semibold"
                  >{{ perfil.primeiro_nome }} {{ perfil.segundo_nome }}</span
                >
              </div>
              <div class="flex flex-row gap-x-8">
                <div class="flex flex-col-reverse">
                  <label class="text">Matrícula</label>
                  <span class="text-lg font-semibold">
                    {{ perfil.numero_matricula }}</span>
                </div>
                <div class="flex flex-col-reverse">
                  <label class="">Etapa</label>
                  <span class="text-lg font-semibold">{{ perfil.titulo }}</span>
                </div>
              </div>
              <p class="text-sm text-gray-500">
                Escola: {{ perfil.nome_escola }}
              </p>
            </div>
          </ion-item>
        </ion-card-header>
      </ion-card>
      <ion-card @click="fale_conosco" class="ion-margin-top">
        <ion-item lines="none" detail="true" button>
          <ion-icon name="logo-whatsapp" slot="start"></ion-icon>
          <ion-label>Fale conosco</ion-label>
        </ion-item>
      </ion-card>
    </ion-content>
    <ion-footer class="ion-no-border">
      <div class="flex flex-col items-end pr-4 pb-6 text-gray-400">
        <a href="http://www.digitalazul.com.br" target="_blank" class="">
          <div class="pl-3" style="font-size: 8pt">Desenvolvido por:</div>
          <div class="font-bold" style="font-size: 9pt">digitalazul.com.br</div>
        </a>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonFooter,
} from "@ionic/vue";
import { person, logoWhatsapp, helpCircle } from "ionicons/icons";
import { addIcons } from "ionicons";
import { SocialSharing } from "@ionic-native/social-sharing";
import axios from "@/configs/axios.config";

addIcons({
  person,
  "logo-whatsapp": logoWhatsapp,
  "help-circle": helpCircle,
});
import { mapGetters } from "vuex";
export default defineComponent({
  name: "Perfil",

  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonFooter,
  },

  data() {
    return {
      perfil: {},
    };
  },

  computed: {
    ...mapGetters("autenticacao", ["get_user"]),
    ...mapGetters("helper", ["get_numero_suporte"]),
  },

  methods: {
    fale_conosco() {
      const {
        primeiro_nome: nome,
        segundo_nome: sobrenome,
        titulo: etapa,
        nome_escola: escola,
        numero_matricula: matricula,
      } = this.perfil;
      const mensagem = `Aluno: *${nome} ${sobrenome}*\nMatricula: *${matricula}*\nEtapa: *${etapa}*\nEscola: *${escola}*\n_Não apague esses dados, pois serve para sua identificação_\n\n\n\n Relate o problema abaixo:\n`;

      SocialSharing.shareViaWhatsAppToPhone(this.get_numero_suporte, mensagem)
        .then(() => console.log("OK"))
        .catch((err) => {
          const element = document.createElement("a");
          const formated = mensagem.replaceAll(/\n/g, "%0D");
          element.href = `https://wa.me/${this.get_numero_suporte}/?text=${formated}`;
          element.target = "_blank";
          element.click();
        });
    },

    obter_perfil() {
      axios
        .get("/alunos/obterPerfil", {
          params: {
            id: this.get_user.id,
          },
        })
        .then(({ data }) => {
          const [perfil] = data;
          this.perfil = perfil;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  ionViewWillEnter() {
    this.obter_perfil();
  },
});
</script>