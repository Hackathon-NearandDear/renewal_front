import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ArrowRightIcon,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import google from "@/assets/google.png";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/router";
import { fetchUser, fetchUserExists } from "@/utils/api/user";
import { User } from "@/utils/interface";
import { NearContext } from "./Near";

export function WalletSelector() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setUser, setUserWallet, user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (wallet) {
      console.log("Wallet connected");
      console.log("Current wallet: ", signedAccountId);

      setUserWallet(signedAccountId);

      const checkAndSetUser = async (address: string) => {
        try {
          const userExists = await fetchUserExists(address);
          //   const isUserExistInBlockchain = await viewTransaction(
          //     "exists_creator_at",
          //     [address]
          //   );

          if (userExists) {
            const userInfo = await fetchUser(address);
            const requiredProps: (keyof User)[] = [
              "user_address",
              "nickname",
              "profile_image_url",
              "gender",
              "country",
              "interest",
            ];
            const missingProps = requiredProps.filter(
              (prop) => !(prop in userInfo)
            );

            if (missingProps.length > 0) {
              console.warn(
                `Missing user properties: ${missingProps.join(", ")}`
              );
            }

            setUser(userInfo as User);
          }
        } catch (error) {
          console.error("Error checking user or fetching user info:", error);
        }
      };

      checkAndSetUser(signedAccountId);
    } else {
      console.log("Wallet disconnected");
    }
  }, [signedAccountId, wallet, setUserWallet, setUser]);

  const handleConnectedButtonClick = useCallback(async () => {
    if (!wallet) return;
    try {
      const userExists = await fetchUserExists(signedAccountId);
      //   const isUserExistInBlockchain = await viewTransaction(
      //     "exists_creator_at",
      //     [account.address]
      //   );
      if (userExists) {
        router.push("/explore");
      } else {
        router.push("/setprofile");
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check user profile. Please try again.",
      });
    }
  }, [signedAccountId, router, toast]);

  return signedAccountId ? (
    <button
      onClick={handleConnectedButtonClick}
      className="w-full bg-[#1F222A] font-semibold py-4 px-6 border border-primary-900 rounded-full mb-8 hover:bg-opacity-70 transition duration-300 ease-in-out flex items-center justify-between"
    >
      <div className="flex-grow" />
      <span className="text-center">{signedAccountId}</span>
      <div className="flex-grow flex justify-end">
        <ArrowRightIcon className="size-5" />
      </div>
    </button>
  ) : (
    <button
      className="w-full bg-[#1F222A] font-semibold py-4 border rounded-full mb-8 hover:bg-opacity-70 transition duration-300 ease-in-out flex items-center justify-center"
      onClick={() => {
        if (wallet) {
          wallet.signIn();
        } else {
          console.error("Wallet is undefined");
        }
      }}
    >
      <div className="flex items-center justify-center w-full">Log in</div>
    </button>
  );
}
