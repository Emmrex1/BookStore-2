import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Mail,
  Phone,
  RotateCcw,
  Trash2,
  UserCheck,
  UserX,
  MoreHorizontal,
  Crown,
  Shield,
  User,
} from "lucide-react";

const getRoleBadge = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "default";
    case "moderator":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusBadge = (isActive) => (isActive ? "default" : "destructive");

const getRoleIcon = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return <Crown className="h-3 w-3" />;
    case "moderator":
      return <Shield className="h-3 w-3" />;
    default:
      return <User className="h-3 w-3" />;
  }
};

const UserCard = ({
  user,
  updateUserStatus,
  deleteUser,
  setSelectedUser,
  setIsProfileOpen,
}) => (
  <div className="p-6 hover:bg-slate-50/50 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <Avatar className="h-10 w-10">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="rounded-full" />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {user.name}
            </h3>
            <Badge
              variant={getRoleBadge(user.role)}
              className="flex items-center gap-1 text-xs"
            >
              {getRoleIcon(user.role)}
              {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1)}
            </Badge>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{user.email}</span>
              <Phone className="h-3 w-3 ml-3" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-1 mt-1 md:mt-0">
              <Calendar className="h-3 w-3" />
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={getStatusBadge(user.isActive)}>
          {user.isActive ? "Active" : "Inactive"}
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedUser(user);
            setIsProfileOpen(true);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        {user.isActive ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 hover:bg-orange-100"
              >
                <UserX className="h-4 w-4 mr-1" />
                Deactivate
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will prevent <strong>{user.name}</strong> from logging
                  into their account. You can  reactivate them at any time.{" "}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateUserStatus(user._id, false)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Deactivate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reactivate
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reactivate User?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will allow <strong>{user.name}</strong> to log into their
                  account again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateUserStatus(user._id, true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Reactivate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{user.name}'s</strong>{" "}
                account and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteUser(user._id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </div>
);

export default UserCard;
