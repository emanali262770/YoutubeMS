// YouTube Management System - Initial Mock Data

export const INITIAL_CHANNELS = [
  {
    id: "chn-1",
    name: "Revenge Stories",
    language: "English",
    category: "Revenge Stories",
    description: "Dramatic true stories and karma revenge animated & narrated videos.",
    subscribers: "1.2M",
    status: "Active",
    color: "bg-red-500",
    avatar: "🔥"
  },
  {
    id: "chn-2",
    name: "Gates Ranks",
    language: "English",
    category: "Ranking",
    description: "Top 10 rankings of extraordinary facts, weapons, technology & luxury.",
    subscribers: "850K",
    status: "Active",
    color: "bg-blue-500",
    avatar: "🏆"
  },
  {
    id: "chn-3",
    name: "Random Dude",
    language: "Spanish",
    category: "Kindness",
    description: "Social experiments, street acts of kindness, and viral storytelling.",
    subscribers: "420K",
    status: "Active",
    color: "bg-emerald-500",
    avatar: "🤝"
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-1",
    fullName: "Ali Ahmed",
    email: "ali.admin@ytms.app",
    role: "Admin",
    status: "Active",
    assignedChannelIds: ["chn-1", "chn-2", "chn-3"],
    lastLogin: "2026-08-07 08:30 AM",
    avatarColor: "bg-purple-600"
  },
  {
    id: "usr-2",
    fullName: "Ahmed",
    email: "ahmed.editor@ytms.app",
    role: "Editor",
    status: "Active",
    assignedChannelIds: ["chn-1", "chn-2"],
    lastLogin: "2026-08-07 07:15 AM",
    avatarColor: "bg-blue-600"
  },
  {
    id: "usr-3",
    fullName: "Sarah Jenkins",
    email: "sarah.script@ytms.app",
    role: "Script Writer",
    status: "Active",
    assignedChannelIds: ["chn-1"],
    lastLogin: "2026-08-06 04:45 PM",
    avatarColor: "bg-amber-600"
  },
  {
    id: "usr-4",
    fullName: "Usman Raza",
    email: "usman.research@ytms.app",
    role: "Researcher",
    status: "Active",
    assignedChannelIds: ["chn-2"],
    lastLogin: "2026-08-07 06:20 AM",
    avatarColor: "bg-emerald-600"
  },
  {
    id: "usr-5",
    fullName: "Maya Lin",
    email: "maya.uploader@ytms.app",
    role: "Uploader",
    status: "Active",
    assignedChannelIds: ["chn-3"],
    lastLogin: "2026-08-05 09:10 PM",
    avatarColor: "bg-rose-600"
  }
];

export const INITIAL_CONTENT = [
  {
    id: "CNT-00001",
    channelId: "chn-1",
    title: "Entitled Boss Fired Me, So I Bought His Landlord's Building",
    sourceUrl: "https://reddit.com/r/ProRevenge/comments/123456",
    sourceTitle: "Pro Revenge: Landlord Building Buyout",
    sourceCreator: "Reddit User u/KarmaKnight",
    status: "In Progress",
    workflowStage: "Script",
    priority: "High",
    contentType: "Longform",
    assignedUserId: "usr-3", // Sarah
    // Writer / Research
    researchNotes: "Verified origin story. Great dialogue potential.",
    scriptWriterId: "usr-3",
    scriptNotes: "Script draft 2 completed. Highlight the legal climax at minute 8.",
    // Editing
    editorUserId: "usr-2", // Ahmed
    editingStatus: "In Progress",
    videoTitle: "Entitled Boss Fired Me — So I Bought His Entire Office Building!",
    // Uploading
    uploaderUserId: "usr-5",
    uploadStatus: "Pending",
    finalTitle: "Entitled Boss Fired Me — So I Bought His Office Building!",
    publishedDate: null,
    createdDate: "2026-08-01",
    updatedDate: "2026-08-06"
  },
  {
    id: "CNT-00002",
    channelId: "chn-1",
    title: "Karen Demanded My First-Class Seat, Got Banned From Airline",
    sourceUrl: "https://youtube.com/watch?v=example_karen1",
    sourceTitle: "Airport Karma Drama",
    sourceCreator: "ViralStories HQ",
    status: "Pending",
    workflowStage: "Research",
    priority: "Medium",
    contentType: "Shorts",
    assignedUserId: "usr-3",
    researchNotes: "Needs fact-checking on airline regulation clause.",
    scriptWriterId: "usr-3",
    scriptNotes: "",
    editorUserId: null,
    editingStatus: "Not Started",
    videoTitle: "",
    uploaderUserId: null,
    uploadStatus: "Pending",
    finalTitle: "",
    publishedDate: null,
    createdDate: "2026-08-04",
    updatedDate: "2026-08-04"
  },
  {
    id: "CNT-00003",
    channelId: "chn-1",
    title: "Cheating Ex Tried To Steal My Dog, Lost Her Entire Inheritance",
    sourceUrl: "https://reddit.com/r/nuclearrevenge/comments/987654",
    sourceTitle: "Dog Custody & Inheritance Climax",
    sourceCreator: "Reddit User u/CanineDefender",
    status: "Completed",
    workflowStage: "Published",
    priority: "High",
    contentType: "Longform",
    assignedUserId: "usr-2",
    researchNotes: "Full legal documents confirmed.",
    scriptWriterId: "usr-3",
    scriptNotes: "Script finalized and audio recorded.",
    editorUserId: "usr-2",
    editingStatus: "Completed",
    videoTitle: "She Tried To Steal My Dog... And Lost Her Whole Inheritance!",
    uploaderUserId: "usr-1",
    uploadStatus: "Uploaded",
    finalTitle: "She Tried To Steal My Dog... And Lost Her Whole Inheritance!",
    publishedDate: "2026-08-05 14:00",
    createdDate: "2026-07-25",
    updatedDate: "2026-08-05"
  },
  {
    id: "CNT-00004",
    channelId: "chn-2",
    title: "Top 10 Most Powerful Futuristic Fighter Jets (2026)",
    sourceUrl: "https://defense-update.com/jets-2026-list",
    sourceTitle: "Global Air Superiority Fighter Jet Report",
    sourceCreator: "AeroTech Journal",
    status: "In Progress",
    workflowStage: "Editing",
    priority: "High",
    contentType: "Longform",
    assignedUserId: "usr-2",
    researchNotes: "Added technical specs for F-35 Block 4 and FCAS.",
    scriptWriterId: "usr-4",
    scriptNotes: "Script voiceover approved.",
    editorUserId: "usr-2",
    editingStatus: "In Progress",
    videoTitle: "Top 10 Futuristic Fighter Jets Flying in 2026",
    uploaderUserId: "usr-5",
    uploadStatus: "Pending",
    finalTitle: "",
    publishedDate: null,
    createdDate: "2026-08-02",
    updatedDate: "2026-08-07"
  },
  {
    id: "CNT-00005",
    channelId: "chn-2",
    title: "10 Mind-Blowing Underwater Megastructures",
    sourceUrl: "https://oceanengineering.org/top-subsea-structures",
    sourceTitle: "Deep Sea Engineering Marvels",
    sourceCreator: "Ocean Deep Review",
    status: "Completed",
    workflowStage: "Published",
    priority: "Low",
    contentType: "Longform",
    assignedUserId: "usr-4",
    researchNotes: "Great 4K ocean footage references.",
    scriptWriterId: "usr-4",
    scriptNotes: "Script ready.",
    editorUserId: "usr-2",
    editingStatus: "Completed",
    videoTitle: "10 Insane Underwater Megastructures Humans Built",
    uploaderUserId: "usr-5",
    uploadStatus: "Uploaded",
    finalTitle: "10 Insane Underwater Megastructures Humans Built",
    publishedDate: "2026-08-03 18:30",
    createdDate: "2026-07-28",
    updatedDate: "2026-08-03"
  },
  {
    id: "CNT-00006",
    channelId: "chn-2",
    title: "Top 5 Billionaire Underground Bunkers Ranked",
    sourceUrl: "https://architecturaldigest.com/bunkers-luxury",
    sourceTitle: "Luxury Bunkers of the 1%",
    sourceCreator: "Lux Living",
    status: "Pending",
    workflowStage: "Pending",
    priority: "Medium",
    contentType: "Shorts",
    assignedUserId: "usr-4",
    researchNotes: "Gathering high res blueprints.",
    scriptWriterId: "usr-4",
    scriptNotes: "",
    editorUserId: null,
    editingStatus: "Not Started",
    videoTitle: "",
    uploaderUserId: null,
    uploadStatus: "Pending",
    finalTitle: "",
    publishedDate: null,
    createdDate: "2026-08-06",
    updatedDate: "2026-08-06"
  },
  {
    id: "CNT-00007",
    channelId: "chn-3",
    title: "Giving $10,000 To Homeless Veteran Who Saved a Puppy",
    sourceUrl: "https://tiktok.com/@kindness_stories/video/998877",
    sourceTitle: "Street Hero Vet Receives Surprise",
    sourceCreator: "TikTok User @KindHeart",
    status: "Completed",
    workflowStage: "Published",
    priority: "High",
    contentType: "Longform",
    assignedUserId: "usr-5",
    researchNotes: "Permissions signed by veteran.",
    scriptWriterId: "usr-5",
    scriptNotes: "Heartwarming story structure.",
    editorUserId: "usr-5",
    editingStatus: "Completed",
    videoTitle: "We Surprised This Homeless Hero Veteran With $10,000!",
    uploaderUserId: "usr-5",
    uploadStatus: "Uploaded",
    finalTitle: "We Surprised This Homeless Hero Veteran With $10,000! (Tears)",
    publishedDate: "2026-08-04 12:00",
    createdDate: "2026-07-29",
    updatedDate: "2026-08-04"
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    contentId: "CNT-00001",
    contentTitle: "Entitled Boss Fired Me, So I Bought His Landlord's Building",
    user: "Sarah Jenkins",
    action: "Status Changed",
    previousStatus: "Pending",
    newStatus: "In Progress",
    dateTime: "2026-08-06 10:15 AM",
    note: "Started script writing and voice directions"
  },
  {
    id: "act-2",
    contentId: "CNT-00004",
    contentTitle: "Top 10 Most Powerful Futuristic Fighter Jets (2026)",
    user: "Ahmed",
    action: "Assigned Content",
    previousStatus: "In Progress",
    newStatus: "In Progress",
    dateTime: "2026-08-07 07:30 AM",
    note: "Ali assigned content editing to Ahmed"
  },
  {
    id: "act-3",
    contentId: "CNT-00003",
    contentTitle: "Cheating Ex Tried To Steal My Dog...",
    user: "Ali Ahmed",
    action: "Uploaded & Completed",
    previousStatus: "In Progress",
    newStatus: "Completed",
    dateTime: "2026-08-05 02:00 PM",
    note: "Published live on YouTube channel"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "usr-2", // Ahmed
    title: "New content assigned to you",
    message: "You were assigned as Editor for 'Top 10 Most Powerful Futuristic Fighter Jets'",
    time: "10 mins ago",
    read: false,
    contentId: "CNT-00004"
  },
  {
    id: "notif-2",
    userId: "usr-2", // Ahmed
    title: "Script Completed",
    message: "Sarah completed script for 'Entitled Boss Fired Me'",
    time: "1 hour ago",
    read: false,
    contentId: "CNT-00001"
  },
  {
    id: "notif-3",
    userId: "usr-3", // Sarah
    title: "New Channel Assigned",
    message: "Admin assigned 'Revenge Stories' channel access to you.",
    time: "Yesterday",
    read: true,
    contentId: null
  }
];

export const SYSTEM_ROLES = [
  {
    name: "Admin",
    description: "Full system access to all channels, users, content, and system configurations.",
    permissions: ["All Channels", "User Management", "Content Management", "System Settings", "Analytics"]
  },
  {
    name: "Script Writer",
    description: "Can work on assigned channels, submit research URLs, and manage script content.",
    permissions: ["Assigned Channels", "Script Editing", "Research Submit", "Status Update"]
  },
  {
    name: "Researcher",
    description: "Can create and manage research & content sources for assigned channels.",
    permissions: ["Assigned Channels", "Source Scraping", "Research Notes"]
  },
  {
    name: "Editor",
    description: "Can manage video rendering, titles, editing status, and production assets.",
    permissions: ["Assigned Channels", "Editing Status", "Video Assets", "Draft Titles"]
  },
  {
    name: "Uploader",
    description: "Can manage final title, publish dates, tags, and uploading status.",
    permissions: ["Assigned Channels", "Upload Status", "Publishing", "Final Metadata"]
  }
];
