export interface BaldnessType {
  id: number;
  title: string;
  type: string;
  grafts: string;
  graftMin: number;
  graftMax: number;
  description: string;
  image: string;
}

export type Gender = 'male' | 'female' | 'other';

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  selectedBaldnessType?: string;
  estimatedGrafts?: string;
  estimatedPrice?: string;
  message?: string;
}
