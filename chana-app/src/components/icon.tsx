import { Icons, type IconName } from "@/constants/icons.generated";
import { useId } from "react";
import Svg, { Circle, Defs, Mask, Path, Rect } from "react-native-svg";

/** "on" draws in the icon color, "off" cuts the shape out (transparent) */
type Paint = "on" | "off";

type IconElement = {
  type: "path" | "circle" | "rect";
  d?: string;
  cx?: number;
  cy?: number;
  r?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rx?: number;
  fill?: Paint;
  stroke?: Paint;
  strokeWidth?: number;
  strokeLinecap?: "round" | "butt" | "square";
  strokeLinejoin?: "round" | "miter" | "bevel";
};

/** One icon from assets/icons, converted by scripts/generate-icons.mjs */
export type IconData = {
  /** Has cut-out details, so it's drawn through a mask */
  knockout: boolean;
  elements: IconElement[];
};

export type IconProps = {
  /** Name of an icon in assets/icons */
  icon: IconName;
  color: string;
  size?: number;
};

const VIEWBOX = 24;

/** Renders an icon from assets/icons in a plain color (e.g. on photos) */
export function Icon({ icon, color, size = 18 }: IconProps) {
  const data: IconData = Icons[icon];
  // Mask ids must be unique per instance and valid inside url(#…)
  const maskId = `icon-mask-${useId().replace(/[^\w-]/g, "")}`;

  if (!data.knockout) {
    return (
      <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
        {data.elements.map((element, i) =>
          renderElement(element, i, () => color),
        )}
      </Svg>
    );
  }

  // Draw the color through a mask: "on" shapes show it, "off" shapes hide it,
  // so cut-out details stay transparent on any background
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
      <Defs>
        <Mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={VIEWBOX}
          height={VIEWBOX}
        >
          {data.elements.map((element, i) =>
            renderElement(element, i, (paint) =>
              paint === "on" ? "#ffffff" : "#000000",
            ),
          )}
        </Mask>
      </Defs>
      <Rect
        width={VIEWBOX}
        height={VIEWBOX}
        fill={color}
        mask={`url(#${maskId})`}
      />
    </Svg>
  );
}

function renderElement(
  element: IconElement,
  key: number,
  colorFor: (paint: Paint) => string,
) {
  const paint = {
    fill: element.fill ? colorFor(element.fill) : "none",
    stroke: element.stroke ? colorFor(element.stroke) : undefined,
    strokeWidth: element.strokeWidth,
    strokeLinecap: element.strokeLinecap,
    strokeLinejoin: element.strokeLinejoin,
  };

  switch (element.type) {
    case "path":
      return <Path key={key} d={element.d} {...paint} />;
    case "circle":
      return (
        <Circle
          key={key}
          cx={element.cx}
          cy={element.cy}
          r={element.r}
          {...paint}
        />
      );
    case "rect":
      return (
        <Rect
          key={key}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rx={element.rx}
          {...paint}
        />
      );
  }
}
