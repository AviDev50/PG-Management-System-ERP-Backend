import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      role_id: user.role_id,
      role: user.role,
      manager_id: user.manager_id || null,
      branch_id: user.branch_id || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export default generateToken;
