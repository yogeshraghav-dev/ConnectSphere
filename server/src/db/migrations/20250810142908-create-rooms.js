module.exports = {
  async up(db) {
    await db.createCollection("rooms", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["isGroup","participants","createdBy","createdAt","updatedAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            name: { bsonType: ["string","null"], maxLength: 140 },
            isGroup: { bsonType: "bool" },
            participants: {
              bsonType: "array",
              minItems: 2,
              items: { bsonType: "objectId" }
            },
            // only for DMs; leave null for groups
            participantsHash: { bsonType: ["string","null"] },
            createdBy: { bsonType: "objectId" },
            lastMessageAt: { oneOf: [{ bsonType: "date" }, { bsonType: "null" }] },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });
    await db.collection("rooms").createIndex({ participants: 1 });
    await db.collection("rooms").createIndex({ lastMessageAt: -1 });
    // one DM per pair (only when isGroup=false and hash is set)
    await db.collection("rooms").createIndex(
      { participantsHash: 1 },
      { unique: true, partialFilterExpression: { isGroup: false, participantsHash: { $type: "string" } } }
    );
  },
  async down(db) { await db.collection("rooms").drop(); }
};
