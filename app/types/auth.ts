export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive" | "banned";

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  googleId?: string;
  stripeCustomerId?: string;
  /** Present when user has pending email verification. Absent/null otherwise. */
  emailVerificationToken?: string | null;
  emailVerificationTokenExpiry?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiry?: string | null;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterResponse extends User {}

export type CurrentUserResponse = User;
