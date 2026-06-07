import { getOrderView } from "@/lib/order-service";

export const dynamic = "force-dynamic";

export default async function FeedbackPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = getOrderView(orderId);

  return (
    <main className="page">
      <h1>Gift feedback</h1>
      <form className="card stack" action="/api/feedback" method="post">
        <input name="orderId" type="hidden" value={orderId} />
        <p className="muted">{order?.item?.name ?? "Gift order"}</p>
        <label>
          Rating
          <select name="rating" defaultValue="5">
            <option value="5">5 - loved it</option>
            <option value="4">4 - good</option>
            <option value="3">3 - okay</option>
            <option value="2">2 - missed</option>
            <option value="1">1 - bad fit</option>
          </select>
        </label>
        <label>
          Did you like it?
          <select name="liked" defaultValue="true">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
        <label>
          Comment
          <textarea name="comment" placeholder="What should BlinkBox learn?" />
        </label>
        <button type="submit">Save feedback</button>
      </form>
    </main>
  );
}
