import { CreateScreen } from "@/components/create-screen";
import { Tabs } from "@/constants/tabs";

export default function NewPost() {
  return <CreateScreen tab={Tabs.home} />;
}
