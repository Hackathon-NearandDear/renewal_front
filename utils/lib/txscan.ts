export function txScanURL(txHash: string) {
  const baseUrl = "https://testnet.nearblocks.io/txns/";
  return baseUrl + txHash;
}
