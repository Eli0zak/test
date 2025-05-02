
import { PlanType, PlanInfo } from '@/types';

// Plan features
export const planFeatures: Record<PlanType, PlanInfo> = {
  basic: {
    name: "Basic",
    description: "Get started with the essentials",
    price: 0,
    color: "bg-pet-green",
    features: {
      maxPets: 1,
      notifications: {
        email: false,
        whatsapp: false
      },
      customPhoto: false,
      locationTracking: false,
      earlyAccess: false,
      unlimited: false
    }
  },
  comfort: {
    name: "Comfort",
    description: "More features for peace of mind",
    price: 4.99,
    color: "bg-pet-purple-light",
    features: {
      maxPets: 3,
      notifications: {
        email: true,
        whatsapp: false
      },
      customPhoto: true,
      locationTracking: false,
      earlyAccess: false,
      unlimited: false
    }
  },
  vip: {
    name: "VIP",
    description: "Ultimate pet protection",
    price: 9.99,
    color: "bg-pet-purple",
    features: {
      maxPets: 999,
      notifications: {
        email: true,
        whatsapp: true
      },
      customPhoto: true,
      locationTracking: true,
      earlyAccess: true,
      unlimited: true
    }
  }
};

export const canUseFeature = (plan: PlanType, feature: keyof PlanInfo['features']): boolean => {
  if (!plan || !planFeatures[plan]) return false;
  
  return !!planFeatures[plan].features[feature];
};

export const canAddMorePets = (plan: PlanType, currentPetCount: number): boolean => {
  if (!plan || !planFeatures[plan]) return false;
  
  return currentPetCount < planFeatures[plan].features.maxPets;
};

export const getPlanColor = (plan: PlanType): string => {
  switch (plan) {
    case 'basic':
      return 'pet-card-basic';
    case 'comfort':
      return 'pet-card-comfort';
    case 'vip':
      return 'pet-card-vip';
    default:
      return 'pet-card-basic';
  }
};
