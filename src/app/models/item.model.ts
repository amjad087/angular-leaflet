import { UserLocation } from './user-location.model';
export interface Item {
  id: number;
  subject: string;
  body: string;
  created_by: string;
  created_at: Date;
  detected_loc: UserLocation;
  provided_loc: UserLocation;
  location?: string;
  category: string;
}
