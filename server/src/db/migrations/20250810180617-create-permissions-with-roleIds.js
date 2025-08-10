// <timestamp>-create-permissions-with-roleIds.js

async function up(db) {
  // Ensure roles exists first (you already created it)
  const rolesExists = await db.listCollections({ name: "roles" }, { nameOnly: true }).toArray();
  if (!rolesExists.length) {
    throw new Error("roles collection must exist before creating permissions");
  }

  const exists = await db.listCollections({ name: "permissions" }, { nameOnly: true }).toArray();
  if (!exists.length) {
    await db.createCollection("permissions", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["key", "createdAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            // unique permission key, e.g. "user.read:any"
            key: { bsonType: "string", minLength: 3 },
            // optional grouping for UI
            group: { bsonType: ["string", "null"] },
            description: { bsonType: ["string", "null"] },

            // YOUR REQUEST: roles that have this permission
            roleIds: {
              bsonType: "array",
              items: { bsonType: "objectId" },
              uniqueItems: true
            },

            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: ["date", "null"] }
          }
        }
      }
    });
  }

  const col = db.collection("permissions");
  await col.createIndex({ key: 1 }, { unique: true, name: "uniq_key" });
  await col.createIndex({ group: 1 }, { name: "by_group" });
  await col.createIndex({ roleIds: 1 }, { name: "by_roleIds" }); // for lookups by role
}

async function down(db) {
  const exists = await db.listCollections({ name: "permissions" }, { nameOnly: true }).toArray();
  if (exists.length) await db.collection("permissions").drop();
}

module.exports = { up, down };
