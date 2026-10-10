import { CreateScreen } from "@/components/layout/create-screen";
import { Tabs } from "@/constants/tabs";

export default function NewPost() {
  return <CreateScreen tab={Tabs.home} />;
}
