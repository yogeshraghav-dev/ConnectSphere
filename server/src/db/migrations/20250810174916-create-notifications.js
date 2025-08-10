module.exports = {
  async up(db) {
    await db.createCollection("notifications", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId", "type", "isRead", "createdAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            userId: { bsonType: "objectId" }, // -> users._id
            type: { bsonType: "string", maxLength: 60 },
            payload: {}, // flexible
            isRead: { bsonType: "bool" },
            deliverAt: { oneOf: [{ bsonType: "date" }, { bsonType: "null" }] },
            createdAt: { bsonType: "date" }
          }
        }
      }
    });

    await db.collection("notifications").createIndex({ userId: 1, isRead: 1, createdAt: -1 });
    await db.collection("notifications").createIndex({ deliverAt: 1 });

    // Optional TTL to auto-clean old notifications after 90 days:
    // await db.collection("notifications").createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 3600 });
  },

  async down(db) {
    await db.collection("notifications").drop();
  }
};
