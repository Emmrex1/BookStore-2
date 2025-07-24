
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import UserCard from "../UserCard/UserCard";
import LoadingSkeleton from "../UserSkeleton/UserSkeleton";
import RoleEditorModal from "./RoleEditorModal/RoleEditorModal";


const UserList = ({
  users,
  loading,
  updateUserStatus,
  deleteUser,
  changeUserRole,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users ({users.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-6">
            <LoadingSkeleton />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No users found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {users.map((user) => (
              <div key={user._id}>
                <UserCard
                  user={user}
                  updateUserStatus={updateUserStatus}
                  deleteUser={deleteUser}
                  setSelectedUser={setSelectedUser}
                  setIsProfileOpen={setIsProfileOpen}
                />
                {/* Edit Role Button */}
                <div className="px-6 py-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Modal */}
        {selectedUser && isProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="text-center">
                  <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined:{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Role Editor Modal */}
         {editingUser && (
          <RoleEditorModal
            user={editingUser}
            onRoleChange={(id, newRole) => {
              changeUserRole(id, newRole);
              setEditingUser(null); 
            }}
            onClose={() => setEditingUser(null)}
          />
        )} 
      </CardContent>
    </Card>
  );
};

export default UserList;
