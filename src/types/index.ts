
export type PlanType = "basic" | "comfort" | "vip";

export type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "reptile" | "other";

export interface Animal {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  type: PetType;
  age: number;
  children_count: number;
  notes: string;
  created_at: string;
  scan_count: number;
  last_scanned_at: string | null;
  plan: PlanType;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan: PlanType;
}

export interface PlanFeatures {
  maxPets: number;
  notifications: {
    email: boolean;
    whatsapp: boolean;
  };
  customPhoto: boolean;
  locationTracking: boolean;
  earlyAccess: boolean;
  unlimited: boolean;
}

export interface PlanInfo {
  name: string;
  description: string;
  price: number;
  color: string;
  features: PlanFeatures;
}
