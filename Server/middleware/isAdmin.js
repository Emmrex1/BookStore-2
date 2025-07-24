
const isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to perform this action. Please login as admin.",
    });
  }
  next();
};

export default isAdmin;
