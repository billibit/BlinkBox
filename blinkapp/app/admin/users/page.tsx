import { getState } from "@/lib/mock-store";
import { getBudget } from "@/lib/budget-service";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  const users = getState().users;

  return (
    <main className="page">
      <h1>Users</h1>
      <section className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Monthly budget</th>
              <th>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const budget = getBudget(user.id);
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{budget ? currency(budget.monthlyLimitCents) : "-"}</td>
                  <td>{user.timezone}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
