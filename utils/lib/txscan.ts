export function txScanURL(txHash: string) {
  const baseUrl = "https://legacy.explorer.near.org/";
  return baseUrl + txHash + "?network=testnet";
}
