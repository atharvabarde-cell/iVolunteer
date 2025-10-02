// Quick debug script for organization events
// Run this in MongoDB shell or using a MongoDB client

// Check all events and their organizationId values
db.events.find({}, {title: 1, organizationId: 1, organization: 1, createdAt: 1})

// Check for the specific organization ID from the logs
db.events.find({"organizationId": ObjectId("68de63c7cf20d1514c775788")})

// Check if this organization ID exists as a user
db.users.find({"_id": ObjectId("68de63c7cf20d1514c775788")}, {name: 1, email: 1, role: 1})

// Check all NGO users
db.users.find({"role": "ngo"}, {name: 1, email: 1, _id: 1})

// Check all events created by NGOs
db.events.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "organizationId", 
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $match: {
      "user.role": "ngo"
    }
  },
  {
    $project: {
      title: 1,
      organizationId: 1,
      organization: 1,
      "user.name": 1,
      "user.role": 1
    }
  }
])

console.log("Run these queries in MongoDB shell to debug the issue");
console.log("Or use a MongoDB GUI tool like MongoDB Compass");