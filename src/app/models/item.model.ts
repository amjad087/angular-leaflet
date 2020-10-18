import { UserLocation } from './user-location.model';
export interface Item {
  subject: string;
  body: string;
  created_by: string;
  created_at: string;
  detected_loc: UserLocation;
  provided_loc: UserLocation;
  location?: string;
  category: string;
}
