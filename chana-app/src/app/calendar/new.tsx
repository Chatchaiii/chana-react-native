import { CreateScreen } from "@/components/create-screen";
import { Tabs } from "@/constants/tabs";

export default function NewEvent() {
  return <CreateScreen tab={Tabs.calendar} />;
}
