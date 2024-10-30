import ProfileForm from "@/components/profile/ProfileForm";

const SetProfilePage = () => {
  return (
    <div className="max-w-[600px] h-screen mx-auto bg-[#1F222A] flex flex-col px-6 text-white py-6">
      <h1 className="text-3xl text-white font-bold mb-4">
        Complete your profile
      </h1>
      <p className="text-lg text-gray-400 mb-8">Select a profile picture!</p>

      <ProfileForm mode="setMode" />
    </div>
  );
};

export default SetProfilePage;
