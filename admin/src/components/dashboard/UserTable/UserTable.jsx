import React, { useState, useEffect, useContext } from "react";
import { AdminContextApi } from "@/context/api/AdmincontexApi";
import axios from "axios";
import { toast } from "sonner";
import UserHeader from "../UserHeader/UserHeader";
import UserStats from "@/components/UserStats/UserStart";
import UserFilters from "../UserFilter/UserFilter";
import UserList from "@/components/UserList/UserList";
import Pagination from "@/components/Pagination/Pagination";

const UserManagement = () => {
  const { backendUrl, token } = useContext(AdminContextApi);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/auth/users`, {
        params: {
          page,
          limit,
          search: searchTerm,
          status: statusFilter,
          role: roleFilter,
        },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUsers(res.data.users);
      setHasMore(res.data.hasMore); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, statusFilter, roleFilter]);

  const updateUserStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${backendUrl}/api/auth/update/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success(
        `User ${newStatus ? "activated" : "deactivated"} successfully`
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  const changeUserRole = async (id, newRole) => {
    try {
      await axios.patch(
        `${backendUrl}/api/auth/update/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/user/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    admins: users.filter((u) => u.role?.toLowerCase() === "admin").length,
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <UserHeader />
      <UserStats stats={stats} />
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
      <UserList
        users={users}
        loading={loading}
        updateUserStatus={updateUserStatus}
        changeUserRole={changeUserRole}
        deleteUser={deleteUser}
      />
      <Pagination page={page} setPage={setPage} hasMore={hasMore} />
    </div>
  );
};

export default UserManagement;
