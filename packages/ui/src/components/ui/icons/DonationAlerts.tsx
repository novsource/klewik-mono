
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
const SvgDonationAlerts = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 14 17" {...props}><g clipPath="url(#DonationAlerts_svg__a)"><path fill="url(#DonationAlerts_svg__b)" d="M5.673 9.833H4.79a.17.17 0 0 1-.134-.066.2.2 0 0 1-.038-.071.2.2 0 0 1-.008-.085l.078-.988c.007-.105.086-.186.18-.186h.883q.08.001.136.067a.22.22 0 0 1 .046.155l-.078.99c-.008.105-.087.185-.181.185zm.141-1.936h-.898a.15.15 0 0 1-.068-.015.2.2 0 0 1-.058-.046.2.2 0 0 1-.04-.07.3.3 0 0 1-.014-.084L4.98 4.34a.24.24 0 0 1 .061-.136.16.16 0 0 1 .12-.052h.899c.098 0 .179.096.179.215l-.253 3.342a.24.24 0 0 1-.059.132.16.16 0 0 1-.114.055zM11.098 4 8.77.644a.6.6 0 0 0-.187-.175.46.46 0 0 0-.23-.062h-6.97a.5.5 0 0 0-.367.174.75.75 0 0 0-.18.435L.002 12.79a.78.78 0 0 0 .143.517.6.6 0 0 0 .184.162.46.46 0 0 0 .22.056h1.37l-.209 3.068 2.69-3.065h3.058a.5.5 0 0 0 .382-.19l2.872-3.447a.75.75 0 0 0 .164-.427l.352-4.963a.8.8 0 0 0-.025-.266.7.7 0 0 0-.105-.233zM8.97 8.517a.75.75 0 0 1-.165.43l-1.663 1.957a.5.5 0 0 1-.379.186H2.696a.5.5 0 0 1-.22-.06.6.6 0 0 1-.182-.163.7.7 0 0 1-.115-.238.8.8 0 0 1-.03-.277l.492-6.894a.75.75 0 0 1 .179-.435.5.5 0 0 1 .368-.174h4.137a.51.51 0 0 1 .413.234l1.313 1.874a.77.77 0 0 1 .142.494z" /></g><defs><linearGradient id="DonationAlerts_svg__b" x1={969.514} x2={-265.942} y1={185.964} y2={1161.17} gradientUnits="userSpaceOnUse"><stop stopColor="#F59C07" /><stop offset={1} stopColor="#F57507" /></linearGradient><clipPath id="DonationAlerts_svg__a"><path fill="#fff" d="M0 .406h14v16.188H0z" /></clipPath></defs></svg>;
};
export default SvgDonationAlerts;
