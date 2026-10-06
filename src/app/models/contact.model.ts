export interface Contact {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactResponse {
  message: string;
  contact: Contact;
}
