"use client";

import { formatCurrency, formatDate } from "@/utils";
import { TypeOrder } from "./page";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Button } from "@/components/ui/button";



export const OrderCard = ({ order }: { order: TypeOrder }) => {
    const statusMap = {
        pending: {
            label: "Pending",
            variant: "warning",
        },
        refunded: {
            label: "Refunded",
            variant: "secondary",
        },
        cancelled: {
            label: "Cancelled",
            variant: "destructive",
        },
        completed: {
            label: "Completed",
            variant: "default",
        },
        confirmed: {
            label: "Confirmed",
            variant: "default",
        },
        delivered: {
            label: "Delivered",
            variant: "default",
        },
        shipped: {
            label: "Shipped",
            variant: "default",
        },
        processing: {
            label: "Processing",
            variant: "default",
        },

    }
    return (
        <div className="text-xs border shadow-sm rounded-md p-2 mb-4">
            <div className="mb-2">
                <div className="flex items-center justify-between">
                    <div className="font-semibold">Order No: {order.order_id}</div>
                    <Badge variant={statusMap[order.status].variant || "default"} >{statusMap[order.status].label}</Badge>
                </div>
                <div><span className="font-semibold">Order Date:</span> {formatDate(order.order_date)}</div>
                <div>
                    <span className="font-semibold">Payment Method:</span> <span className="capitalize">{order.payment_method}</span>
                </div>
                <div><span className="font-semibold">Expected Delivery Date:</span> {formatDate(moment(order.order_date).add(7, 'days'))}</div>
            </div>

            <div className="my-4">

                {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <img src={item.product.cover_image} alt={item.product.product_name} className="w-10 h-10 object-cover rounded-md shadow-sm" />
                        <div className="overflow-hidden">
                            <div className="whitespace-nowrap line-clamp-1 overflow-hidden text-ellipsis">{item.product.product_name}</div>
                            <div className="font-medium">{formatCurrency(item.amount)}</div>
                        </div>
                    </div>
                ))}
            </div>



            <div className="flex items-center justify-between mt-2 ">
                <div><span className="font-semibold">Quantity:</span> {order.total_qty}</div>
                <div><span className="font-semibold">Total Amount:</span> {formatCurrency(order.grand_total)}</div>
            </div>
            <div>
                <Button size="sm" className="mt-4 py-1 h-6 text-xs">View Details</Button>
            </div>
        </div>
    )
}
