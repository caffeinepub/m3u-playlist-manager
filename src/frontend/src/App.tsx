import { Layout } from "@/components/Layout";
import { Channels } from "@/pages/Channels";
import { Validate } from "@/pages/Validate";
import { useState } from "react";

export type AppTab = "channels" | "validate";

export default function App() {
  const [tab, setTab] = useState<AppTab>("channels");

  return (
    <Layout activeTab={tab} onTabChange={setTab}>
      {tab === "channels" ? <Channels /> : <Validate />}
    </Layout>
  );
}
