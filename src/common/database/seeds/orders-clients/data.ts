import { LuggageTypes, OrderStatuses } from 'common/enums/enums';

export interface CompanyInterface {
  name: string;
  logo: string;
  email: string;
}

export const companyData: CompanyInterface = {
  name: 'Luggage delivery',
  logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Flogo.com%2Flogos%2Fdelivery&psig=AOvVaw1rc39fINQBlb7YDfXL0FJk&ust=1730539970672000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjPu4TquokDFQAAAAAdAAAAABAE',
  email: 'delivery.company@gmial.com',
};

export interface CustomerInterface {
  full_name: string;
  phone_number: string;
  email: string;
}

export const customersData: CustomerInterface[] = [
  { full_name: 'Alice Johnson', phone_number: '+380-67-123-4567', email: 'alice.johnson@example.com' },
  { full_name: 'Bob Smith', phone_number: '+380-50-234-5678', email: 'bob.smith@example.com' },
  { full_name: 'Charlie Brown', phone_number: '+380-63-345-6789', email: 'charlie.brown@example.com' },
  { full_name: 'Daisy Green', phone_number: '+380-95-456-7890', email: 'daisy.green@example.com' },
  { full_name: 'Evan Black', phone_number: '+380-67-567-8901', email: 'evan.black@example.com' },
  { full_name: 'Fiona White', phone_number: '+380-50-678-9012', email: 'fiona.white@example.com' },
  { full_name: 'George Harris', phone_number: '+380-63-789-0123', email: 'george.harris@example.com' },
  { full_name: 'Hannah Clark', phone_number: '+380-95-890-1234', email: 'hannah.clark@example.com' },
  { full_name: 'Ian Lee', phone_number: '+380-67-901-2345', email: 'ian.lee@example.com' },
  { full_name: 'Julia Martinez', phone_number: '+380-50-012-3456', email: 'julia.martinez@example.com' },
];

export interface OrderInterface {
  collection_date: Date;
  status: OrderStatuses;
  customer_name: string;
  luggages: LuggageInterface[];
}

export interface LuggageInterface {
  luggage_type: LuggageTypes;
  luggage_weight: number;
}

export const luggagesData: LuggageInterface[] = [
  { luggage_type: LuggageTypes.BIG, luggage_weight: 23 },
  { luggage_type: LuggageTypes.MIDDLE, luggage_weight: 7 },
  { luggage_type: LuggageTypes.BIG, luggage_weight: 15 },
  { luggage_type: LuggageTypes.SMALL, luggage_weight: 5 },
  { luggage_type: LuggageTypes.SMALL, luggage_weight: 3 },
];

export const ordersData: OrderInterface[] = [
  { collection_date: new Date('2024-11-01'), status: OrderStatuses.AT_RISK, customer_name: 'Alice Johnson', luggages: [luggagesData[0]] },
  { collection_date: new Date('2024-11-02'), status: OrderStatuses.COMPLETED, customer_name: 'Bob Smith', luggages: [luggagesData[1]] },
  { collection_date: new Date('2024-11-03'), status: OrderStatuses.AT_RISK, customer_name: 'Charlie Brown', luggages: [luggagesData[2]] },
  { collection_date: new Date('2024-11-04'), status: OrderStatuses.NOT_ARRIVED, customer_name: 'Daisy Green', luggages: [luggagesData[3]] },
  { collection_date: new Date('2024-11-05'), status: OrderStatuses.FAILED, customer_name: 'Evan Black', luggages: [luggagesData[4]] },
  { collection_date: new Date('2024-11-06'), status: OrderStatuses.UPCOMING, customer_name: 'Fiona White', luggages: [luggagesData[0]] },
  { collection_date: new Date('2024-11-07'), status: OrderStatuses.UPCOMING, customer_name: 'George Harris', luggages: [luggagesData[1]] },
  {
    collection_date: new Date('2024-11-08'),
    status: OrderStatuses.NOT_ARRIVED,
    customer_name: 'Hannah Clark',
    luggages: [luggagesData[2]],
  },
  { collection_date: new Date('2024-11-09'), status: OrderStatuses.UPCOMING, customer_name: 'Ian Lee', luggages: [luggagesData[3]] },
  {
    collection_date: new Date('2024-11-10'),
    status: OrderStatuses.NOT_ARRIVED,
    customer_name: 'Julia Martinez',
    luggages: [luggagesData[4]],
  },
  { collection_date: new Date('2024-11-11'), status: OrderStatuses.FAILED, customer_name: 'Alice Johnson', luggages: [luggagesData[0]] },
  { collection_date: new Date('2024-11-12'), status: OrderStatuses.NOT_ARRIVED, customer_name: 'Bob Smith', luggages: [luggagesData[1]] },
  { collection_date: new Date('2024-11-13'), status: OrderStatuses.UPCOMING, customer_name: 'Charlie Brown', luggages: [luggagesData[2]] },
  { collection_date: new Date('2024-11-14'), status: OrderStatuses.UPCOMING, customer_name: 'Daisy Green', luggages: [luggagesData[3]] },
  { collection_date: new Date('2024-11-15'), status: OrderStatuses.AT_RISK, customer_name: 'Evan Black', luggages: [luggagesData[4]] },
  { collection_date: new Date('2024-11-16'), status: OrderStatuses.UPCOMING, customer_name: 'Fiona White', luggages: [luggagesData[0]] },
  { collection_date: new Date('2024-11-17'), status: OrderStatuses.UPCOMING, customer_name: 'George Harris', luggages: [luggagesData[1]] },
  { collection_date: new Date('2024-11-18'), status: OrderStatuses.UPCOMING, customer_name: 'Hannah Clark', luggages: [luggagesData[2]] },
  { collection_date: new Date('2024-11-19'), status: OrderStatuses.UPCOMING, customer_name: 'Ian Lee', luggages: [luggagesData[3]] },
  {
    collection_date: new Date('2024-11-20'),
    status: OrderStatuses.NOT_ARRIVED,
    customer_name: 'Julia Martinez',
    luggages: [luggagesData[4]],
  },
  { collection_date: new Date('2024-11-21'), status: OrderStatuses.AT_RISK, customer_name: 'Alice Johnson', luggages: [luggagesData[0]] },
  { collection_date: new Date('2024-11-22'), status: OrderStatuses.UPCOMING, customer_name: 'Bob Smith', luggages: [luggagesData[1]] },
  { collection_date: new Date('2024-11-23'), status: OrderStatuses.UPCOMING, customer_name: 'Charlie Brown', luggages: [luggagesData[2]] },
  { collection_date: new Date('2024-11-24'), status: OrderStatuses.UPCOMING, customer_name: 'Daisy Green', luggages: [luggagesData[3]] },
  { collection_date: new Date('2024-11-25'), status: OrderStatuses.AT_RISK, customer_name: 'Evan Black', luggages: [luggagesData[4]] },
  { collection_date: new Date('2024-11-26'), status: OrderStatuses.FAILED, customer_name: 'Fiona White', luggages: [luggagesData[0]] },
  { collection_date: new Date('2024-11-27'), status: OrderStatuses.AT_RISK, customer_name: 'George Harris', luggages: [luggagesData[1]] },
  { collection_date: new Date('2024-11-28'), status: OrderStatuses.COMPLETED, customer_name: 'Hannah Clark', luggages: [luggagesData[2]] },
  { collection_date: new Date('2024-11-29'), status: OrderStatuses.UPCOMING, customer_name: 'Ian Lee', luggages: [luggagesData[3]] },
  {
    collection_date: new Date('2024-11-30'),
    status: OrderStatuses.COMPLETED,
    customer_name: 'Julia Martinez',
    luggages: [luggagesData[4]],
  },
];

export interface LuggageImgsInterface {
  link: string;
}

export const luggageImgsData: LuggageImgsInterface[] = [
  {
    link: 'https://link-to-luggage-img',
  },
  {
    link: 'https://link-to-luggage-img',
  },
];
