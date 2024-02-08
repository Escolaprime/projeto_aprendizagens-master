import { Storage } from "@capacitor/storage";
import { AppVersion } from "@ionic-native/app-version";
import { App } from "@capacitor/app";
import { alertController } from "@ionic/vue";
import axios from "@/configs/axios.config.js";

const KEY_STORAGE = "app_stats";

(async () => {
  const apk_local = {
    app_name: await AppVersion.getAppName(),
    package_name: await AppVersion.getPackageName(),
    version_code: await AppVersion.getVersionCode(),
    version_number: await AppVersion.getVersionNumber(),
  };
  const {
    data: { parametro: versao_db },
  } = await axios.get("/apk/obterVersaoApk", {
    params: {
      CRC: 9,
    },
  });

  const { value } = await Storage.get({ key: KEY_STORAGE });
  const version_local = JSON.parse(value);

  if (!value) {
    return await Storage.set({
      key: KEY_STORAGE,
      value: JSON.stringify(apk_local),
    });
  }

  if (apk_local.version_number != versao_db) {
    const alert = await alertController.create({
      header: "Atualização na loja",
      message:
        "O nosso app foi atualizado. Acesse a loja para baixar a nova atualização",
      backdropDismiss: false,
      buttons: [
        {
          text: "Baixar atualização",
          handler: async () => {
            const element = document.createElement("a");
            element.href = `https://play.google.com/store/apps/details?id=com.digitalazul.app`;
            element.target = "_blank";
            element.click();
            App.exitApp();
          },
        },
      ],
    });

    await alert.present();
  }
})();
