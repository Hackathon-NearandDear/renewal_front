import ProfileForm from "@/components/profile/ProfileForm";

const EditProfilePage = () => {
  return (
    <div className="max-w-[600px] mx-auto flex flex-col text-white">
      <p className="text-lg text-gray-400 mb-8">
        Update your profile information
      </p>

      <ProfileForm mode="editMode" />
    </div>
  );
};

export default EditProfilePage;
