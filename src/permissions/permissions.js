import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem } from '@capacitor/filesystem';


export const requestPermissionNotifications = () => LocalNotifications.requestPermissions();
export const requestPermissionFilesystem = () => Filesystem.requestPermissions();