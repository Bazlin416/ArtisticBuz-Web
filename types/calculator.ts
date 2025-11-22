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

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  selectedBaldnessType?: string;
  estimatedGrafts?: string;
  message?: string;
}
