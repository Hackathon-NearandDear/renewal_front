// Near.ts
import { createContext } from "react";

// near api js
import { providers, utils } from "near-api-js";

// wallet selector
import "@near-wallet-selector/modal-ui/styles.css";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupSender } from "@near-wallet-selector/sender";

// ethereum wallets
import { wagmiConfig, web3Modal } from "./web3modal";
import { setupEthereumWallets } from "@near-wallet-selector/ethereum-wallets";

const THIRTY_TGAS = "30000000000000";
const NO_DEPOSIT = "0";
export const CONTRACT_ADDRESS = "neardearrenew4.testnet";

interface NearContext {
  wallet?: Wallet;
  signedAccountId: string;
}

export class Wallet {
  createAccessKeyFor: undefined;
  networkId: "mainnet" | "testnet";
  selector: any;
  constructor({
    networkId = "testnet" as "mainnet" | "testnet",
    createAccessKeyFor = undefined,
  }) {
    this.createAccessKeyFor = createAccessKeyFor;
    this.networkId = networkId;
  }

  startUp = async (accountChangeHook: (signedAccountId: string) => void) => {
    this.selector = setupWalletSelector({
      network: this.networkId,
      modules: [
        setupMyNearWallet(),
        setupHereWallet(),
        setupLedger(),
        setupMeteorWallet(),
        setupSender(),
      ],
    });

    const walletSelector = await this.selector;
    const isSignedIn = walletSelector.isSignedIn();
    const accountId = isSignedIn
      ? walletSelector.store.getState().accounts[0].accountId
      : "";

    walletSelector.store.observable.subscribe((state: { accounts: any[] }) => {
      const signedAccount = state?.accounts.find(
        (account: { active: any }) => account.active
      )?.accountId;
      accountChangeHook(signedAccount || "");
    });

    return accountId;
  };

  signIn = async () => {
    const modal = setupModal(await this.selector, {
      contractId: this.createAccessKeyFor || "",
    });
    modal.show();
  };

  signOut = async () => {
    const selectedWallet = await (await this.selector).wallet();
    selectedWallet.signOut();
  };

  viewMethod = async ({
    contractId,
    method,
    args = {},
  }: {
    contractId: string;
    method: string;
    args?: object;
  }) => {
    const url = `https://rpc.${this.networkId}.near.org`;
    const provider = new providers.JsonRpcProvider({ url });

    const res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "optimistic",
    });
    return JSON.parse(Buffer.from((res as any).result).toString());
  };

  callMethod = async ({
    contractId,
    method,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  }: {
    contractId: string;
    method: string;
    args?: object;
    gas?: string;
    deposit?: string;
  }) => {
    const selectedWallet = await (await this.selector).wallet();
    const outcome = await selectedWallet.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: { methodName: method, args, gas, deposit },
        },
      ],
    });
    return [providers.getTransactionLastResult(outcome), outcome];
  };

  getTransactionResult = async (txhash: string) => {
    const walletSelector = await this.selector;
    const { network } = walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const transaction = await provider.txStatus(txhash, "unnused");
    return providers.getTransactionLastResult(transaction);
  };

  getBalance = async (accountId: string) => {
    const walletSelector = await this.selector;
    const { network } = walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const account = await provider.query({
      request_type: "view_account",
      account_id: accountId,
      finality: "final",
    });
    return account;
  };

  signAndSendTransactions = async ({
    transactions,
  }: {
    transactions: object[];
  }) => {
    const selectedWallet = await (await this.selector).wallet();
    return selectedWallet.signAndSendTransactions({ transactions });
  };

  getAccessKeys = async (accountId: string) => {
    const walletSelector = await this.selector;
    const { network } = walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const keys = await provider.query({
      request_type: "view_access_key_list",
      account_id: accountId,
      finality: "final",
    });
    return keys;
  };
}

export const NearContext = createContext<NearContext>({
  wallet: undefined,
  signedAccountId: "",
});
