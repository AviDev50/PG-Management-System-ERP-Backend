import bcrypt from "bcryptjs";
import db from "./src/common/config/db.js"; // <-- apne database connection ka path

async function seedSuperAdmin() {
  try {
    // Check if Super Admin already exists
    const [existingUser] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      ["superadmin@gmail.com"]
    );

    if (existingUser.length > 0) {
      console.log("✅ Super Admin already exists.");
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash("12345", 10);

    // Insert user
    await db.query(
      `INSERT INTO users (
        role_id,
        name,
        email,
        password_hash,
        is_active
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        1,
        "Super Admin",
        "superadmin@gmail.com",
        passwordHash,
        1,
      ]
    );

    console.log("✅ Super Admin created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
    process.exit(1);
  }
}

seedSuperAdmin();