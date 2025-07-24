import React, { useContext, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { ShopContext } from "@/context/ShopContext";
import {
  User,
  Camera,
  Upload,
  Loader2,
  Check,
  Mail,
  UserIcon,
  Sparkles,
  ShieldOff,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { motion } from "framer-motion";
import ChangePasswordModal from "./ChangePassword/ChangePassword";
import { Link } from "react-router-dom";

const ProfileSettings = () => {
  const { user, setUser, backendUrl, token, logout } = useContext(ShopContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image size should be less than 5MB");

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
      toast("Image selected", {
        icon: <Sparkles className="text-yellow-500" />,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim())
      return toast.error("Please fill in all required fields");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Enter a valid email");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    if (avatarFile) formData.append("image", avatarFile);

    setProfileLoading(true);
    try {
      const res = await axios.patch(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.notifications) {
          setNotifications(res.data.user.notifications);
        }
        
        setAvatarFile(null);
        setAvatarPreview(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      setProfileLoading(false);
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data.success) {
          setUser(res.data.user);
          setNotifications(res.data.user.notifications || []);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);
  

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <Link to="/">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Avatar Upload Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a new avatar to personalize your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={avatarPreview || user?.avatar} />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </motion.div>

            <Separator />

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files.length > 0)
                  handleFileSelect(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF (max 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Info and Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <Button
                type="submit"
                disabled={profileLoading}
                className="w-full"
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </form>

            <div className="pt-6 flex flex-col gap-2">
              {/* Change Password */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsModalOpen(true)}
              >
                Change Password
              </Button>

              {/* Deactivate Account */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Deactivate Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <ShieldOff className="w-5 h-5 text-yellow-500" />
                      Deactivate your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You can reactivate it later by logging in. Are you sure
                      you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={async () => {
                        try {
                          const res = await axios.patch(
                            `${backendUrl}/api/user/deactivate`,
                            {},
                            {
                              headers: { Authorization: `Bearer ${token}` },
                              withCredentials: true,
                            }
                          );
                          if (res.data.success) {
                            toast.success(
                              "Account deactivated. Logging out..."
                            );
                            setTimeout(() => logout(), 2000);
                          } else {
                            toast.error(res.data.message);
                          }
                        } catch (error) {
                          console.error("Deactivate error:", error);
                          toast.error("Failed to deactivate account");
                        }
                      }}
                    >
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Delete Account */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      Delete your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your data will be
                      permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={async () => {
                        try {
                          const res = await axios.delete(
                            `${backendUrl}/api/user/delete`,
                            {
                              headers: { Authorization: `Bearer ${token}` },
                              withCredentials: true,
                            }
                          );

                          if (res.data.success) {
                            toast.success("Account deleted");
                            logout();
                          } else {
                            toast.error(
                              res.data.message || "Failed to delete account"
                            );
                          }
                        } catch (error) {
                          console.error("Delete error:", error);
                          toast.error("Something went wrong");
                        }
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Stay updated on your activity</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-muted-foreground">
                You have no notifications.
              </p>
            ) : (
              <ul className="space-y-4">
                {notifications.slice(0, 5).map((n, idx) => (
                  <li key={idx} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold capitalize">
                        {n.type.replace(/-/g, " ")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{n.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        backendUrl={backendUrl}
        token={token}
      />
    </div>
  );
};

export default ProfileSettings;
