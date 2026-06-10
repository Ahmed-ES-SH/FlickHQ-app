/* =========================================================
   Contact Module — Type Definitions
   Based on backend ContactMessage entity + DTOs
========================================================= */

/** A contact message submitted via the public contact form. */
export type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt: string | null; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

/** Payload for submitting a contact message. */
export type CreateContactMessagePayload = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

/** Response from the submit endpoint. */
export type SubmitContactResponse = {
  message: string;
  id: string;
};

/** Static fallback contact message used for user-facing history. */
export type UserContactMessage = Pick<
  ContactMessage,
  "id" | "fullName" | "email" | "subject" | "message" | "repliedAt" | "createdAt"
>;
