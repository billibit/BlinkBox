import { runDueSchedules } from "../lib/schedule-service";

const created = runDueSchedules();
console.log(`Created ${created.length} pending decision(s).`);
