import mongoose from "mongoose";
import bcryptjs from "bcryptjs"; 

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
     phone: { type: String, required: false },
     passwordResetToken: String,
     passwordResetExpires: Date,
    cartData: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      }
    ],
    
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
 

  
  { minimize: false, timestamps: true } 
);


userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hashedPassword = await bcryptjs.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = function (givenPassword) {
  return bcryptjs.compare(givenPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
