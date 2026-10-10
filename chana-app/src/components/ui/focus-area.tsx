import { isPressBlocked } from "@/utils/press-guard";
import type { RefObject } from "react";
import { Pressable, type PressableProps, type TextInput } from "react-native";

export type FocusAreaProps = Omit<PressableProps, "onPress"> & {
  /** The input a tap on this area focuses */
  inputRef: RefObject<TextInput | null>;
};

/**
 * Wrapper around an input that focuses it when tapped, so the field's padding
 * and whatever else sits around the text count as part of the field. Use it
 * in place of the View an input is wrapped in
 */
export function FocusArea({ inputRef, ...rest }: FocusAreaProps) {
  return (
    <Pressable
      // The input inside is what screen readers should land on
      accessible={false}
      {...rest}
      onPress={() => {
        // Not while a swipe opens the drawer (see utils/press-guard)
        if (!isPressBlocked()) inputRef.current?.focus();
      }}
    />
  );
}
