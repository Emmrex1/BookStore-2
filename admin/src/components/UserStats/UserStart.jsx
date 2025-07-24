import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Crown } from "lucide-react";

const UserStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm">Total Users</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <Users className="h-8 w-8" />
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm">Active</p>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <UserCheck className="h-8 w-8" />
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm">Inactive</p>
          <p className="text-2xl font-bold">{stats.inactive}</p>
        </div>
        <UserX className="h-8 w-8" />
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm">Admins</p>
          <p className="text-2xl font-bold">{stats.admins}</p>
        </div>
        <Crown className="h-8 w-8" />
      </CardContent>
    </Card>
  </div>
);

export default UserStats;
