import { ArrowRightIcon } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/router";
import { fetchUser, fetchUserExists } from "@/utils/api/user";
import { User } from "@/utils/interface";
import { CONTRACT_ADDRESS, NearContext } from "./Near";

export function WalletSelector() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setUserWallet, user } = useUserStore();
  const router = useRouter();

  const checkWalletConnection = useCallback(async () => {
    if (!wallet) return null;

    try {
      const walletSelector = await wallet.selector;
      const isSignedIn = walletSelector.isSignedIn();

      if (isSignedIn) {
        const accounts = walletSelector.store.getState().accounts;
        console.log("Connected accounts:", accounts);

        if (accounts && accounts.length > 0) {
          const activeAccount = accounts.find((account: any) => account.active);
          console.log("Active account:", activeAccount);
          return activeAccount?.accountId;
        }
      }
      return null;
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return null;
    }
  }, [wallet]);

  const fetchUserData = useCallback(
    async (address: string) => {
      if (!address) return false;

      setIsLoading(true);
      try {
        const userExists = await fetchUserExists(address);

        if (userExists) {
          const userInfo = await fetchUser(address);

          if (userInfo) {
            setUser(userInfo as User);
            return true;
          }
        } else {
          const newUser: User = {
            user_address: address,
            nickname: "",
            profile_image_url: "",
            gender: "",
            country: "",
            interest: "",
          };
          setUser(newUser);
        }
        return false;
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, toast],
  );

  useEffect(() => {
    const initializeUserData = async () => {
      if (signedAccountId) {
        console.log("signedAccountId detected:", signedAccountId);
        setUserWallet(signedAccountId);
        await fetchUserData(signedAccountId);
      }
    };

    initializeUserData();
  }, [signedAccountId, setUserWallet, fetchUserData]);

  const handleSignIn = async () => {
    if (wallet) {
      try {
        console.log("Starting wallet sign in...");
        await wallet.signIn();
        console.log("Wallet sign in completed");

        const accountId = await checkWalletConnection();
        if (accountId) {
          console.log("Sign in successful, account ID:", accountId);
          setUserWallet(accountId);
          await fetchUserData(accountId);
        }
      } catch (error) {
        console.error("Error during sign in:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign in. Please try again.",
        });
      }
    }
  };

  return signedAccountId ? (
    <button
      disabled={isLoading}
      className="w-full bg-[#1F222A] font-semibold py-4 px-6 border border-primary-900 rounded-full mb-8 hover:bg-opacity-70 transition duration-300 ease-in-out flex items-center justify-between"
    >
      <div className="flex-grow" />
      <span className="text-center">
        {isLoading ? "Loading..." : signedAccountId}
      </span>
      <div className="flex-grow flex justify-end">
        <ArrowRightIcon className="size-5" />
      </div>
    </button>
  ) : (
    <button
      className="w-full bg-[#1F222A] font-semibold py-4 border rounded-full mb-8 hover:bg-opacity-70 transition duration-300 ease-in-out flex items-center justify-center"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      <div className="flex items-center justify-center w-full">
        {isLoading ? "Connecting..." : "Log in"}
      </div>
    </button>
  );
}
