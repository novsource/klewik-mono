import * as React from "react";
import type { SVGProps } from "react";
type Sizes = 'xs' | 'sm' | 'default' | 'lg';
type IconsProps = SVGProps<SVGSVGElement> & {
  size?: Sizes;
};
const sizes: Record<Sizes, number> = {
  xs: 16,
  sm: 18,
  default: 21,
  lg: 24
};
const SvgProgramming = (props: IconsProps) => {
  props = {
    ...props,
    width: sizes[props.size] ?? props.width ?? sizes['default'],
    height: sizes[props.size] ?? props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M8.502 5.715A.75.75 0 1 0 7.498 4.6L5.761 6.163c-.737.663-1.347 1.213-1.767 1.711-.44.525-.754 1.088-.754 1.783s.313 1.259.754 1.783c.42.498 1.03 1.048 1.767 1.71l1.737 1.564A.75.75 0 1 0 8.502 13.6l-1.697-1.527c-.788-.71-1.319-1.19-1.663-1.599-.33-.392-.402-.622-.402-.817s.072-.425.402-.817c.344-.41.875-.89 1.663-1.599zM14.18 4.603a.75.75 0 0 1 .532.917l-3.987 15a.75.75 0 1 1-1.45-.385l3.987-15a.75.75 0 0 1 .918-.532M15.443 10.826a.75.75 0 0 1 1.059-.056l1.737 1.564c.737.662 1.347 1.212 1.767 1.71.44.525.754 1.088.754 1.784 0 .695-.313 1.258-.754 1.782-.42.499-1.03 1.049-1.767 1.711l-1.737 1.564a.75.75 0 1 1-1.004-1.115l1.697-1.527c.788-.709 1.319-1.19 1.663-1.598.33-.393.402-.622.402-.817 0-.196-.072-.425-.402-.818-.344-.409-.875-.89-1.663-1.598l-1.697-1.527a.75.75 0 0 1-.055-1.06" /></svg>;
};
export default SvgProgramming;