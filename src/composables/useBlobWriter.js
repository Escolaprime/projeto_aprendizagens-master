import blobWriter from "capacitor-blob-writer";
import { Directory } from "@capacitor/filesystem";

export default function useBlobWriter() {
  const writerFile = ({ path, blob }) => {
    return blobWriter({
      path,
      blob,
      directory: Directory.External,
      recursive: true,
      on_fallback(error) {
        console.error(error);
      },
    });
  };

  return {
    writerFile,
  };
}
