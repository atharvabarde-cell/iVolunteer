export const pointsRules = [
  { id: "PTS001", type: "eventParticipation", points: 50, description: "Participate in 1 event" },
  { id: "PTS002", type: "eventDonation", points: 100, description: "Donate in 1 event" },
  { id: "PTS009", type: "firstDonation", points: 50, description: "First donation bonus" }, 
  { id: "PTS003", type: "dailyLogin", points: 10, description: "Daily login" },
  { id: "PTS004", type: "firstEvent", points: 75, description: "Complete first event" },
  { id: "PTS005", type: "eventFeedback", points: 20, description: "Give feedback for an event" },
  { id: "PTS006", type: "referral", points: 150, description: "Refer a friend" },
  { id: "PTS007", type: "milestone5Events", points: 250, description: "Participate in 5 events" },
  { id: "PTS008", type: "milestone10Events", points: 500, description: "Participate in 10 events" },
];


export const badgeRules = [
  { id: "BDG001", name: "Rising Star", criteriaPoints: 50, description: "Complete first event", tier: "Bronze", icon: "⭐" },
  { id: "BDG002", name: "Event Enthusiast", criteriaPoints: 250, description: "Participate in 5 events", tier: "Silver", icon: "🏆" },
  { id: "BDG003", name: "Event Champion", criteriaPoints: 500, description: "Participate in 10 events", tier: "Gold", icon: "🥇" },
  { id: "BDG004", name: "Generous Heart", criteriaPoints: 100, description: "Donate in 1–3 events", tier: "Silver", icon: "❤️" },
  { id: "BDG005", name: "Daily Devotee", criteriaPoints: 70, description: "Login 7 days in a row", tier: "Bronze", icon: "📅" },
  { id: "BDG006", name: "Connector", criteriaPoints: 150, description: "Refer 1–3 friends", tier: "Silver", icon: "🔗" },
  { id: "BDG007", name: "Voice of Users", criteriaPoints: 100, description: "Give feedback for 5 events", tier: "Bronze", icon: "🗨️" },
];
