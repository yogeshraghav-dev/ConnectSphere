/* create-rooms: DM & group rooms with unique DM constraint */
module.exports = {
  async up(db) {
    await db.createCollection("rooms", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["isGroup", "participants", "createdBy", "createdAt", "updatedAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },

            // Optional name (used for groups)
            name: { bsonType: ["string", "null"], maxLength: 140 },

            isGroup: { bsonType: "bool" },

            // “FK-like” to users: array of User _id
            participants: {
              bsonType: "array",
              minItems: 2,
              items: { bsonType: "objectId" }
            },

            // For DMs only, we’ll store a stable hash of the two userIds
            participantsHash: { bsonType: ["string", "null"] },

            // “FK-like” to users: creator _id
            createdBy: { bsonType: "objectId" },

            // Last message time (nullable)
            lastMessageAt: {
              oneOf: [{ bsonType: "date" }, { bsonType: "null" }]
            },

            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });

    // Indexes for queries
    await db.collection("rooms").createIndex({ participants: 1 });
    await db.collection("rooms").createIndex({ lastMessageAt: -1 });

    // Ensure **one DM per pair** using participantsHash
    await db.collection("rooms").createIndex(
      { participantsHash: 1 },
      {
        unique: true,
        partialFilterExpression: {
          isGroup: false,
          participantsHash: { $type: "string" }
        }
      }
    );
  },

  async down(db) {
    await db.collection("rooms").drop();
  }
};
