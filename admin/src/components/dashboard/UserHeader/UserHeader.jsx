const UserHeader = () => (
  <div className="flex flex-col space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform users and their permissions
        </p>
      </div>
    </div>
  </div>
);

export default UserHeader;
