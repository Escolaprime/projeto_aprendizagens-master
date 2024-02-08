import { Network } from "@capacitor/network";
export default function useNetwork() {
  const getNetworkStatus = async () => {
    return await Network.getStatus();
  };
  return {
    Network,
    getNetworkStatus,
  };
}
