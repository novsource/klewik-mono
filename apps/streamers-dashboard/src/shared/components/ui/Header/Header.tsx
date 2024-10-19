import {Icons} from '@ui/icons';
import {PropsWithChildren} from 'react';

const Header = ({children}: PropsWithChildren) => {
  return (
    <header className="w-full h-16">
      <div className="px-4 h-full w-full flex justify-between items-center gap-x-4">
        <Icons.Logo />
        <div className="">{children}</div>
      </div>
    </header>
  );
};

export default Header;
