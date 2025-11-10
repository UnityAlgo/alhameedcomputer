"use client"

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { OrdersPage } from "./order-component";
import { axiosClient } from "@/api";
import { OrderCard } from "./order-card"
import { Spinner } from "@/components/ui/spinner";

export type TypeOrder = {
  id: string;
  order_id: string;
  status: 'pending' | 'completed' | 'cancelled' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'refunded';
  grand_total: number;
  payment_method: string;
  total_qty: number;
  total_taxes_and_charges: number;
  order_date: string;
};

const useOrderQuery = (): UseQueryResult<TypeOrder[]> => {
  return useQuery<TypeOrder[], Error>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axiosClient.get('api/orders');
      return res.data;
    },
  });
};


const Index = () => {
  const { data, error, isLoading } = useOrderQuery();

  console.log(data, error);

  return (
    <div className="py-6">
      <div className="mb-4 ">
        <div className="font-semibold">My Orders</div>

      </div>

      {

        isLoading ? <div>
          <div className="flex flex-col items-center justify-center py-6">
            <Spinner className="mb-2" />
            Loading..
          </div>
        </div> :
          (!data || data.length === 0 || error) ?
            <div className="text-center">No orders found.</div>
            : <div>
              {data.map((order => (
                <OrderCard key={order.id} order={order} />
              )))}
            </div>
      }
    </div>
  )
}

export default Index