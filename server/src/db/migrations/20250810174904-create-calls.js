module.exports = {
  async up(db) {
    await db.createCollection("calls", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["roomId", "callerId", "status", "startedAt", "createdAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            roomId: { bsonType: "objectId" },     // -> rooms._id
            callerId: { bsonType: "objectId" },   // -> users._id
            calleeIds: {
              bsonType: "array",
              items: { bsonType: "objectId" }     // -> users._id
            },
            scheduleId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] }, // -> schedules._id
            status: { enum: ["ringing", "active", "ended", "missed"] },
            startedAt: { bsonType: "date" },
            endedAt: { oneOf: [{ bsonType: "date" }, { bsonType: "null" }] },
            endedReason: { oneOf: [{ bsonType: "string" }, { bsonType: "null" }] },
            createdAt: { bsonType: "date" }
          }
        }
      }
    });

    await db.collection("calls").createIndex({ roomId: 1, startedAt: -1 });
    await db.collection("calls").createIndex({ status: 1, startedAt: -1 });
    await db.collection("calls").createIndex({ scheduleId: 1 });
  },

  async down(db) {
    await db.collection("calls").drop();
  }
};
