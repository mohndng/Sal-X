// Fix: Adding a new UserProfile interface for the new feature.
export type TransactionType = 'salary' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  details: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  employment: string;
  profilePictureUrl: string | null;
  coverPhotoUrl: string | null;
}
