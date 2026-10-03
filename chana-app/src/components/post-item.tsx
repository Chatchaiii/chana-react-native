import { ImageCarousel, ImageCarouselProps } from "./image-carousel";
import { ListItem } from "./list-item";
import { TextItem } from "./text-item";

export type PostItemProps = {
  images?: ImageCarouselProps["images"];
};

// Placeholder photos until posts have real images

/** Row with an avatar, a title + subtitle and a trailing icon. */
export function PostItem({ images }: PostItemProps) {
  return (
    <>
      <ListItem />
      {images && <ImageCarousel images={images} />}
      <TextItem />
    </>
  );
}
