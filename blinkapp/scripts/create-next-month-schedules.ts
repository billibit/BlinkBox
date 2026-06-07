import { getState } from "../lib/mock-store";
import { nextRandomMonthlyDate } from "../lib/utils";

for (const schedule of getState().schedules) {
  schedule.nextRunAt = nextRandomMonthlyDate();
}

console.log(`Updated ${getState().schedules.length} schedule row(s).`);
