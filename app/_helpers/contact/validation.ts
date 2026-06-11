// //////////////////////////////////////////////////////////////////////////////
// /////// Contact form validation — mirrors backend rules ////////////////////
// //////////////////////////////////////////////////////////////////////////////

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export function validateFields(fields: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = {
    fullName: fields.fullName.trim(),
    email: fields.email.trim(),
    subject: fields.subject.trim(),
    message: fields.message.trim(),
  };

  if (!trimmed.fullName) errors.fullName = "Name is required";
  else if (trimmed.fullName.length > 100)
    errors.fullName = "Name must be 100 characters or less";

  if (!trimmed.email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(trimmed.email))
    errors.email = "Please enter a valid email address";
  else if (trimmed.email.length > 255)
    errors.email = "Email must be 255 characters or less";

  if (!trimmed.subject) errors.subject = "Subject is required";
  else if (trimmed.subject.length > 200)
    errors.subject = "Subject must be 200 characters or less";

  if (!trimmed.message) errors.message = "Message is required";
  else if (trimmed.message.length < 10)
    errors.message = "Message must be at least 10 characters";
  else if (trimmed.message.length > 5000)
    errors.message = "Message must be 5000 characters or less";

  return errors;
}
