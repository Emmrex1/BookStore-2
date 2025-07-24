import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { AdminContextApi } from "@/context/AdminContextApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is too short"),
  address: z.string().min(5, "Address is required"),
});

const AdminProfile = () => {
  const { user, token, backendUrl, setUser } = useContext(AdminContextApi);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Set current user values on load
  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("address", user.address || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user, setValue]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatarToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", avatarFile);
    formData.append("upload_preset", "your_upload_preset");
    formData.append("folder", "admin-avatars");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", 
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      toast.error("Avatar upload failed");
      console.error(err);
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      let avatarUrl = user?.avatar || "";
      if (avatarFile) {
        const uploadedUrl = await uploadAvatarToCloudinary();
        if (uploadedUrl) avatarUrl = uploadedUrl;
      }

      const res = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        { ...data, avatar: avatarUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setUser(res.data.updatedUser);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6 dark:bg-slate-900">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">
        Admin Profile
      </h2>
       <Link to="/">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Avatar upload */}
        <div className="space-y-2">
          <Label htmlFor="avatar">Profile Avatar</Label>
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}
          <Input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} disabled />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default AdminProfile;
