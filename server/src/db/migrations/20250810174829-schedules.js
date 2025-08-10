module.exports = {
  async up(db) {
    await db.createCollection("schedules", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "title", "createdBy", "participants", "callType",
            "scheduledAt", "remindAt", "status", "joinLinkToken", "createdAt", "updatedAt"
          ],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            title: { bsonType: "string", maxLength: 140 },
            createdBy: { bsonType: "objectId" }, // -> users._id
            participants: {
              bsonType: "array",
              minItems: 1,
              items: { bsonType: "objectId" } // -> users._id
            },
            roomId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] }, // optional -> rooms._id
            callType: { enum: ["audio", "video"] },
            scheduledAt: { bsonType: "date" },
            remindAt: { bsonType: "date" },
            status: { enum: ["scheduled", "cancelled", "completed"] },
            joinLinkToken: { bsonType: "string" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });

    await db.collection("schedules").createIndex({ scheduledAt: 1 });
    await db.collection("schedules").createIndex({ remindAt: 1 });
    await db.collection("schedules").createIndex({ participants: 1 });
    await db.collection("schedules").createIndex({ joinLinkToken: 1 }, { unique: true });
  },

  async down(db) {
    await db.collection("schedules").drop();
  }
};
