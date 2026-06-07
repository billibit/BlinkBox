import { listCatalogItems } from "@/lib/catalog-service";
import { currency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const dynamic = "force-dynamic";

export default function AdminCatalogPage() {
  const items = listCatalogItems();

  return (
    <main className="page">
      <h1>Catalog</h1>
      <p className="lede">Curated gifts with known availability and fulfilment notes.</p>
      <section className="card sunny table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <StatusBadge status={item.type} />
                </td>
                <td>{item.category}</td>
                <td>{currency(item.priceCents)}</td>
                <td>{item.stock}</td>
                <td>{item.supplierNotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
