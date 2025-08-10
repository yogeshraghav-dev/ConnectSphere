/* init-users: create users collection with validator + indexes */
module.exports = {
  async up(db) {
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "name", "passwordHash", "role", "status", "createdAt", "updatedAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
            name: { bsonType: "string", minLength: 2, maxLength: 80 },
            passwordHash: { bsonType: "string", minLength: 20 },
            avatarUrl: { bsonType: ["string", "null"] },
            role: { enum: ["user", "admin"] },
            status: { enum: ["online", "away", "dnd", "offline"] },
            workingHours: {
              bsonType: "object",
              required: ["tz", "startMins", "endMins"],
              properties: {
                tz: { bsonType: "string" },
                startMins: { bsonType: "int", minimum: 0, maximum: 1440 },
                endMins: { bsonType: "int", minimum: 0, maximum: 1440 }
              }
            },
            lastSeenAt: { bsonType: ["date", "null"] },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });

    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ lastSeenAt: -1 });
    await db.collection("users").createIndex({ role: 1 });
  },

  async down(db) {
    await db.collection("users").drop();
  }
};
