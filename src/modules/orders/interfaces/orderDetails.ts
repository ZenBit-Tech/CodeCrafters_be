import { LuggageTypes } from 'common/enums/enums';

interface TransformedLuggage {
  luggageType: LuggageTypes;
  luggageWeight: number;
}

export interface OrderDetails {
  collectionDate: Date;
  collectionTimeStart: Date;
  collectionTimeEnd: Date;
  collectionAddress: string;
  airportName: string;
  flightId: string;
  customerFullName: string;
  customerPhoneNumber: string;
  dispatcherFullName: string;
  dispatcherPhoneNumber: string;
  luggages: TransformedLuggage[];
}
