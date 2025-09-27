import { Event } from "../models/Event.js";

// Migration script to fix participants field type
export const migrateParticipantsField = async () => {
  try {
    console.log("Starting migration of participants field...");

    // Find all events where participants is a number
    const eventsToMigrate = await Event.find({
      participants: { $type: "number" }
    });

    console.log(`Found ${eventsToMigrate.length} events to migrate`);

    let migratedCount = 0;

    for (const event of eventsToMigrate) {
      try {
        // Update the event to have an empty participants array
        await Event.updateOne(
          { _id: event._id },
          { $set: { participants: [] } }
        );
        migratedCount++;
        console.log(`Migrated event: ${event.title} (${event._id})`);
      } catch (error) {
        console.error(`Failed to migrate event ${event._id}:`, error);
      }
    }

    console.log(`Migration completed. ${migratedCount}/${eventsToMigrate.length} events migrated successfully.`);
    return { success: true, migratedCount };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error: error.message };
  }
};

// Function to check and migrate a single event if needed
export const checkAndMigrateEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      return { success: false, message: "Event not found" };
    }

    if (typeof event.participants === 'number') {
      await Event.updateOne(
        { _id: eventId },
        { $set: { participants: [] } }
      );
      console.log(`Auto-migrated event ${eventId}: participants field converted from number to array`);
      return { success: true, message: "Event migrated successfully" };
    }

    return { success: true, message: "Event already has correct format" };
  } catch (error) {
    console.error(`Failed to migrate event ${eventId}:`, error);
    return { success: false, error: error.message };
  }
};