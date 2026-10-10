import { List } from "@/components/ui/list";
import { PlaceItem } from "@/components/places/place-item";
import { ScreenScrollView } from "@/components/layout/screen-scroll-view";
import { TabScreen } from "@/components/layout/tab-screen";
import { Tabs } from "@/constants/tabs";
import { PLACEHOLDER_PLACES } from "@/data/places";

export default function Places() {
  return (
    <TabScreen tab={Tabs.places}>
      <ScreenScrollView>
        <List>
          {PLACEHOLDER_PLACES.map((place) => (
            <PlaceItem key={place.id} place={place} />
          ))}
        </List>
      </ScreenScrollView>
    </TabScreen>
  );
}
