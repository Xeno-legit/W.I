export interface WeaponSpec {
  label: string;
  value: string;
}

export interface WeaponData {
  name: string;
  type: string;
  manufacturer: string;
  origin: string;
  year: string;
  description: string;
  specs: WeaponSpec[];
  isValidWeapon: boolean;
  suggestedName?: string; // For typo corrections
}

export interface SimilarWeapon {
  name: string;
  type: string;
  origin: string;
}

export interface SearchResult {
  data: WeaponData | null;
  imageUrl: string | null;
  error: string | null;
}