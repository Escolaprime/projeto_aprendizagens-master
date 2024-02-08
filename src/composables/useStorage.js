import { Storage } from "@capacitor/storage";

export default function useStorage() {
  const setStorage = (key, value) => {
    return Storage.set({
      key,
      value,
    });
  };
  const setAsJsonStorage = (key, value) => {
    return setStorage(key, unParseValueJson(value));
  };

  const getAsJsonStorage = async (key) => {
    const json = await getStorage(key);
    return parseValueJson(json);
  };
  const getStorage = async (key) => {
    const { value } = await Storage.get({
      key,
    });
    return value;
  };
  const deleteStorage = async (key) => {
    return await Storage.remove({ key });
  };
  const clearStorage = () => {
    return Storage.clear();
  };

  const parseValueJson = (value) => {
    return JSON.parse(value);
  };
  const unParseValueJson = (value) => {
    return JSON.stringify(value);
  };
  return {
    getStorage,
    setStorage,
    deleteStorage,
    clearStorage,
    setAsJsonStorage,
    getAsJsonStorage,
  };
}
