import {PropsWithChildren} from 'react';

const AuctionDashboardLayout = ({children}: PropsWithChildren) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default AuctionDashboardLayout;
