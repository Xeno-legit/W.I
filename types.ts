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
}

export interface SearchResult {
  data: WeaponData | null;
  imageUrl: string | null;
  error: string | null;
}