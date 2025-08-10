// <ts>-init-superadmin.js
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

// must match the _id you used in seed-roles.js
const SUPER_ADMIN_ROLE_ID = new ObjectId("66b6f0000000000000000001");

async function ensureIndexIfMissing(col, key, options = {}) {
  const existing = await col.indexes();
  const has = existing.some(ix => JSON.stringify(ix.key) === JSON.stringify(key));
  if (!has) await col.createIndex(key, options);
}

async function up(db) {
  console.log("[init-superadmin] starting… DB:", db.databaseName);

  const users = db.collection("users");
  // avoid index name clashes if {email:1} already exists under a different name
  await ensureIndexIfMissing(users, { email: 1 }, { unique: true, name: "uniq_email" });
  await ensureIndexIfMissing(users, { roleId: 1 }, { name: "by_roleId" });

  // envs (fallbacks for dev)
  const email = process.env.INIT_SUPERADMIN_EMAIL || "superadmin@example.com";
  const name = process.env.INIT_SUPERADMIN_NAME || "Super Admin";
  const password = process.env.INIT_SUPERADMIN_PASSWORD || "SuperSecure@123";

  // upsert superadmin user
  const existing = await users.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await users.insertOne({
      email,
      name,
      passwordHash,          // ✅ matches your users validator
      roleId: SUPER_ADMIN_ROLE_ID,
      status: "active",
      createdAt: new Date(),
      updatedAt: null,
    });
    console.log(`[init-superadmin] created: ${email}`);
  } else {
    // ensure roleId is set
    if (!existing.roleId || String(existing.roleId) !== String(SUPER_ADMIN_ROLE_ID)) {
      await users.updateOne(
        { _id: existing._id },
        { $set: { roleId: SUPER_ADMIN_ROLE_ID, updatedAt: new Date() } }
      );
      console.log(`[init-superadmin] updated roleId for: ${email}`);
    } else {
      console.log(`[init-superadmin] exists: ${email}`);
    }
  }
}

async function down(db) {
  const email = process.env.INIT_SUPERADMIN_EMAIL || "superadmin@example.com";
  await db.collection("users").deleteOne({ email });
  console.log("[init-superadmin] removed:", email);
}

module.exports = { up, down };
