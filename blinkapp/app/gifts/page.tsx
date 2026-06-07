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
      <p className="lede">Your surprises live here after they are ready to be remembered.</p>
      <div className="grid">
        {orders.length ? (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <section className="card sky">
            <h3>Nothing to reveal yet.</h3>
            <p className="muted">The best part is not knowing too early.</p>
          </section>
        )}
      </div>
    </main>
  );
}
