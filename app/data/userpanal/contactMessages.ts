// //////////////////////////////////////////////////////////////////////////////
// ///////// Contact Messages — static fallback data ////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

import type { UserContactMessage } from "@/app/types/contact";

export const STATIC_CONTACT_MESSAGES: UserContactMessage[] = [
  {
    id: "msg_static_001",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    subject: "Question about premium pricing",
    message:
      "Hello, I would like to know more about the enterprise plan pricing tiers. We are a small team of 5 and are interested in the annual subscription.",
    repliedAt: "2026-06-08T14:22:00.000Z",
    createdAt: "2026-06-07T10:15:30.000Z",
  },
  {
    id: "msg_static_002",
    fullName: "John Smith",
    email: "john.smith@example.com",
    subject: "Bug report: UI glitch on dashboard",
    message:
      "I found a small UI glitch on the dashboard page when resizing the browser window on mobile view. The sidebar overlaps with the main content.",
    repliedAt: null,
    createdAt: "2026-06-06T13:55:00.000Z",
  },
  {
    id: "msg_static_003",
    fullName: "Sarah Johnson",
    email: "sarah.j@example.com",
    subject: "Feature request: Offline downloads",
    message:
      "Would love to see an offline download feature for premium users. I travel frequently and having the ability to download movies for offline viewing would be a game-changer.",
    repliedAt: "2026-06-05T09:30:00.000Z",
    createdAt: "2026-06-04T18:20:00.000Z",
  },
  {
    id: "msg_static_004",
    fullName: "Mike Chen",
    email: "mike.chen@example.com",
    subject: "Account billing inquiry",
    message:
      "I was charged twice for my monthly subscription this month. Could you please check and process a refund for the duplicate charge?",
    repliedAt: null,
    createdAt: "2026-06-03T08:45:00.000Z",
  },
  {
    id: "msg_static_005",
    fullName: "Emily Davis",
    email: "emily.d@example.com",
    subject: "Content suggestion: More documentaries",
    message:
      "As a documentary enthusiast, I would love to see more nature and science documentaries added to the platform. Your current selection is great but could be expanded.",
    repliedAt: "2026-06-02T16:10:00.000Z",
    createdAt: "2026-06-01T22:30:00.000Z",
  },
];
