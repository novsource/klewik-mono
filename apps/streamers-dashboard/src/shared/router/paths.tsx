import {ReactNode} from 'react';

type Path = {
  path: string;
  element?: ReactNode;
};
type Paths = Path[];

export const paths: Paths = [
  {
    path: '/wheel',
    // element: <AuctionWheelPage />,
  },
  {
    path: '/slots',
    element: <div>slots</div>,
  },
  {
    path: '/donations',
    element: <div>donations</div>,
  },
  {
    path: '/settings',
    element: <div>settings</div>,
  },
];
