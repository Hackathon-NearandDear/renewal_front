import { useState, useEffect } from "react";
import { UserRound } from "lucide-react";
import Image from "next/image";
import GenderSelect from "@/components/profile/GenderSelect";
import CountrySelect from "@/components/profile/CountrySelect";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAptosCall } from "@/utils/hooks/useAptos";
import { fetchUserExists, registerUser, updateUser } from "@/utils/api/user";
import { User } from "@/utils/interface";

interface ProfileFormProps {
  mode: "setMode" | "editMode";
}

const profileImages = [
  "https://apptos.s3.ap-southeast-2.amazonaws.com/1.png",
  "https://apptos.s3.ap-southeast-2.amazonaws.com/2.png",
  "https://apptos.s3.ap-southeast-2.amazonaws.com/3.png",
];

const ProfileForm: React.FC<ProfileFormProps> = ({ mode }) => {
  const { account } = useWallet();

  const { user, setUser } = useUserStore();
  const [nickname, setNickname] = useState<string>(user ? user?.nickname : "");
  const [gender, setGender] = useState<string>(user ? user?.gender! : "");
  const [country, setCountry] = useState<string>(user ? user.country! : "");
  const [interest, setInterest] = useState<string>(user ? user?.interest! : "");
  const [profileImageUrl, setProfileImageUrl] = useState<string>(user ? user?.profile_image_url! : "");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { executeTransaction, viewTransaction } = useAptosCall();

  const registerUserProfile = async (userData: User) => {
    try {
      const isUserExistInBlockchain = await viewTransaction("exists_creator_at", [userData.user_address])
      const res = (async() => {
        if (isUserExistInBlockchain) {
          const res = await executeTransaction("reset_user", []);
          return res
        } else {
          const res = await executeTransaction("register_user", []);
          return res
        }
      })();

      const result = await res
      if (result) {
        const userExists = await fetchUserExists(userData.user_address);
        if (userExists) {
          const result = await updateUser(userData);
        } else {
          const result = await registerUser(userData);
        }
        setUser(userData);
        router.push("/explore");
      } else {
        window.alert("Fail to Register User");
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (userData: User) => {
    try {
      const result = await updateUser(userData);
      setUser(userData);
      router.push("/mypage");
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!account || !account.address) {
      window.alert("Wallet address is not available");
      router.push("/");
      return;
    }

    try {
      const userData: User = {
        user_address: account?.address!,
        nickname: nickname, // Add nickname if needed
        profile_image_url: profileImageUrl,
        gender: gender,
        country: country,
        interest: interest,
      };

      switch (mode) {
        case "setMode":
          await registerUserProfile(userData);
          break;
        case "editMode":
          await updateUserProfile(userData);
          break;
      }
    } catch (err) {
      setError("Failed to submit. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {ProfileImage(profileImageUrl)}

      {ProfileSelectionSection(profileImages, profileImageUrl, setProfileImageUrl)}

      {NicknameSection(nickname, setNickname)}

      <GenderSelect value={gender ? gender : ""} onChange={setGender} />

      <CountrySelect value={country ? country : ""} onChange={setCountry} />

      {InteresetSection(interest, setInterest)}

      {error && <p className="text-red-500">{error}</p>}

      <div className="pb-20 flex-shrink-0">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-900 text-white py-4 rounded-full font-medium disabled:bg-gray-600"
        >
          {isLoading
            ? "Loading..."
            : mode === "setMode"
            ? "Create Account"
            : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;

const ProfileImage = (profileImageUrl: string) => {
  return (
    <div className="size-32 bg-[#2A2D36] rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
      {profileImageUrl === "" ? (
        <UserRound className="text-gray-400 size-24" />
      ) : (
        <Image
          src={profileImageUrl}
          alt="Selected profile"
          width={128}
          height={128}
          className="object-cover transform scale-150 translate-y-[-10%]"
        />
      )}
    </div>
  );
};

const ProfileSelectionSection = ( profileImages: any, profileImageUrl: string, setProfileImageUrl: any) => {
  return(
    <div className="flex justify-center space-x-4 mb-8">
      {profileImages.map((img: any, index: any) => (
        <button
          type="button"
          key={index}
          onClick={() => setProfileImageUrl(profileImages[index])}
          className={`size-16 rounded-full overflow-hidden border-2 bg-[#2A2D36] ${
            profileImageUrl === profileImages[index]
              ? "border-primary-900"
              : "border-transparent"
          }`}
        >
          <Image
            src={img}
            alt={`Profile ${index + 1}`}
            width={64}
            height={64}
            className="object-cover transform scale-150 translate-y-[-10%]"
          />
        </button>
      ))}
    </div>
  );
};

const NicknameSection = (nickname: string, setNickname: any) => {
  return (
    <div>
      <label
        htmlFor="nickname"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Nickname
      </label>
      <input
        type="text"
        id="nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="w-full p-2 border-b border-gray-600 focus:border-primary-900 focus:outline-none bg-transparent text-white"
        placeholder="Name"
        required
      />
    </div>
  );
};

const InteresetSection = (interest: string, setInterest: any) => {
  return (
    <div>
      <label
        htmlFor="interest"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Field of Interest
      </label>
      <div className="flex">
        <input
          type="text"
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full p-2 border-b border-gray-600 focus:border-primary-900 focus:outline-none bg-transparent text-white"
          placeholder="Education, Fitness, Blockchain etc..."
        />
      </div>
    </div>
  );
};
