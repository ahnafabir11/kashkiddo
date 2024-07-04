import Client from "./client";
import Server from "./server";

export default function page() {
  return (
    <div>
      <Server />
      <Client />
    </div>
  );
}
