import { Order } from 'common/database/entities/order.entity';

export interface TransformedOrder {
  id: number;
  collection_date: Date;
  collection_time_start: Date;
  collection_time_end: Date;
  airport_name: string;
  flight_id: string;
  ticket_photo: string;
  full_name: string;
}

export const tranformOrderObject = (order: Order): TransformedOrder => {
  return {
    id: order.id,
    collection_date: order.collection_date,
    collection_time_start: order.collection_time_start,
    collection_time_end: order.collection_time_end,
    airport_name: order.airport_name,
    flight_id: order.flight_id,
    ticket_photo: order.ticket_photo,
    full_name: order.customer.full_name,
  };
};
