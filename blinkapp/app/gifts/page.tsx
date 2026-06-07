import { getCurrentUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/order-service";
import { OrderCard } from "@/components/order/OrderCard";

export const dynamic = "force-dynamic";

export default async function GiftsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const orders = listOrdersForUser(user.id);

  return (
    <main className="page">
      <h1>Gifts</h1>
      <p className="lede">Track approved gifts, fulfilment, and feedback.</p>
      <div className="grid">
        {orders.length ? orders.map((order) => <OrderCard key={order.id} order={order} />) : <p className="muted">No gifts have been approved yet.</p>}
      </div>
    </main>
  );
}
