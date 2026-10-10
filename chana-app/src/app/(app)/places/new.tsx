import { CreateScreen } from "@/components/layout/create-screen";
import { Tabs } from "@/constants/tabs";

export default function NewPlace() {
  return <CreateScreen tab={Tabs.places} />;
}
