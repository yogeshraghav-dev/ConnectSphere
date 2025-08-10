// <ts>-alter-users-add-roleId.js
async function up(db) {
  // Relax/extend schema to allow roleId (optional)
  await db.command({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "name", "passwordHash", "status", "createdAt"],
        additionalProperties: false,
        properties: {
          _id: { bsonType: "objectId" },
          email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
          name: { bsonType: "string", minLength: 2 },
          passwordHash: { bsonType: "string", minLength: 20 },
          status: { enum: ["active", "disabled"] },
          avatarUrl: { bsonType: ["string", "null"] },
          // NEW: platform/global role (optional)
          roleId: { bsonType: ["objectId", "null"] },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: ["date", "null"] }
        }
      }
    }
  });

  // Helpful index for lookups
  await db.collection("users").createIndex({ roleId: 1 }, { name: "by_roleId" });
}

async function down(db) {
  // Remove roleId field from docs (optional)
  await db.collection("users").updateMany({ roleId: { $exists: true } }, { $unset: { roleId: "" } });

  // Best-effort: re-tighten validator without roleId
  await db.command({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "name", "passwordHash", "status", "createdAt"],
        additionalProperties: false,
        properties: {
          _id: { bsonType: "objectId" },
          email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
          name: { bsonType: "string", minLength: 2 },
          passwordHash: { bsonType: "string", minLength: 20 },
          status: { enum: ["active", "disabled"] },
          avatarUrl: { bsonType: ["string", "null"] },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: ["date", "null"] }
        }
      }
    }
  });
}
module.exports = { up, down };
