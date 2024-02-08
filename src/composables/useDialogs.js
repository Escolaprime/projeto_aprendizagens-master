import {
  alertController,
  AlertOptions,
  loadingController,
  LoadingOptions,
  modalController,
  ModalOptions,
  toastController,
  ToastOptions,
  actionSheetController,
  ActionSheetOptions,
} from "@ionic/vue";
export default function useDialog() {
  /**
   * @param { ActionSheetOptions } options
   */
  const actionSheet = async (options) =>
    actionSheetController.create({
      ...options,
    });

  /**
   * @param { AlertOptions } options
   */
  const alert = async (options) =>
    alertController.create({
      ...options,
    });

  /**
   * @param { LoadingOptions } options
   */
  const loading = async (options) => loadingController.create({ ...options });
  const loadingDismiss = (data, role, id) =>
    loadingController.dismiss(data, role, id);

  /**
   * @param { ModalOptions } options
   */
  const modal = async (options) =>
    modalController.create({
      ...options,
    });

  const modalDismiss = (data, role, id) =>
    modalController.dismiss(data, role, id);
  /**
   * @param { ToastOptions } options
   */
  const toast = async (options) => toastController.create({ ...options });

  return {
    actionSheet,
    alert,
    loading,
    loadingDismiss,
    modal,
    modalDismiss,
    toast,
  };
}
