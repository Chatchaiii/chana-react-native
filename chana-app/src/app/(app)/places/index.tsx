import { List } from "@/components/list";
import { PlaceItem } from "@/components/place-item";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
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
