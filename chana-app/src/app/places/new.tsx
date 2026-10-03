import { CreateScreen } from "@/components/create-screen";
import { Tabs } from "@/constants/tabs";

export default function NewPlace() {
  return <CreateScreen tab={Tabs.places} />;
}
