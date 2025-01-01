import { LuggageTypes, OrderStatuses } from 'common/enums/enums';

interface TransformedLuggage {
  luggageType: LuggageTypes;
  luggageWeight: number;
}

export interface OrderDetails {
  collectionDate: Date;
  status: OrderStatuses;
  collectionTimeStart: Date;
  collectionTimeEnd: Date;
  collectionAddress: string;
  airportName: string;
  flightId: string;
  customerId: number;
  customerFullName: string;
  customerPhoneNumber: string;
  dispatcherFullName: string;
  dispatcherPhoneNumber: string;
  luggages: TransformedLuggage[];
}
