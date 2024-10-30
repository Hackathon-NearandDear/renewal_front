export function txScanURL(txHash: string) {
  const baseUrl = "https://aptoscan.com/transaction/";
  return baseUrl + txHash + "?network=testnet";
}
