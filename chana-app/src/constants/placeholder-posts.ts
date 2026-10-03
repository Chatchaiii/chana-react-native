import type { Post } from "@/components/post-item";

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

/** Stand-in content until posts come from real data */
export const PLACEHOLDER_POSTS: Post[] = [
  {
    id: "1",
    author: "chadchai",
    postedAt: "2 days ago",
    text: LOREM,
  },
  {
    id: "2",
    author: "chadchai",
    postedAt: "2 days ago",
    text: LOREM,
    images: [1, 2, 3, 4].map(
      (n) => `https://picsum.photos/seed/chana-${n}/800/1000`,
    ),
  },
];
