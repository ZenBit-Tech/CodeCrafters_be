import { Route } from 'common/database/entities/route.entity';
import { RouteInform } from 'common/types/routeInformResponse';

export const transformRouteObject = (routeObject: Route): RouteInform => {
  return {
    id: routeObject.id,
    submission_date: routeObject.submission_date,
    arrival_date: routeObject.arrival_date,
    distance: routeObject.distance,
    status: routeObject.status,
    driver: {
      id: routeObject.user_id.id,
      full_name: routeObject.user_id.full_name,
      email: routeObject.user_id.email,
    },
    orders: routeObject.orders.map((order) => ({
      id: order.id,
      collection_date: order.collection_date,
      collection_time_start: order.collection_time_start,
      collection_time_end: order.collection_time_end,
      collection_address: order.collection_address,
      status: order.status,
    })),
  };
};
