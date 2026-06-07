import { OrderCard } from "@/components/order/OrderCard";
import { listOrders } from "@/lib/order-service";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  const orders = listOrders();

  return (
    <main className="page">
      <h1>Orders</h1>
      <p className="lede">Approved and charged gifts move here for manual admin fulfilment.</p>
      <div className="grid">
        {orders.length ? orders.map((order) => <OrderCard key={order.id} order={order} admin />) : <p className="muted">No orders yet. Approve a decision first.</p>}
      </div>
    </main>
  );
}
