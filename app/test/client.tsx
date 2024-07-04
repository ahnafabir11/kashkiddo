"use client";

import { startOfToday } from "date-fns";

export default function Client() {
  console.log("JS Date", new Date());
  console.log("SNF Start Today", startOfToday());

  return <div>client</div>;
}
