export interface DbItem {
  subject: string;
  body: string;
  loc: {
    type: { type: string },
    coordinates: []
  };
  lng: any;
  lat: any;
  category: string;
}
