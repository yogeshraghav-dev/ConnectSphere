// 20250810234128-create-roles.js

async function ensureCollection(db) {
  const exists = await db
    .listCollections({ name: "roles" }, { nameOnly: true })
    .toArray();

  if (!exists.length) {
    await db.createCollection("roles", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "createdAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            name: { bsonType: "string", minLength: 2, description: "Role name" },
            description: { bsonType: ["string", "null"] },
            permissions: {
              bsonType: ["array", "null"],
              items: { bsonType: "string" },
              uniqueItems: true
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: ["date", "null"] }
          }
        }
      }
    });
  }
}

async function ensureIndexes(db) {
  const col = db.collection("roles");
  await col.createIndex({ name: 1 }, { unique: true, name: "uniq_name" });
}

async function up(db, client) {
  await ensureCollection(db);
  await ensureIndexes(db);
}

async function down(db, client) {
  const exists = await db
    .listCollections({ name: "roles" }, { nameOnly: true })
    .toArray();
  if (exists.length) {
    await db.collection("roles").drop();
  }
}

module.exports = { up, down };
