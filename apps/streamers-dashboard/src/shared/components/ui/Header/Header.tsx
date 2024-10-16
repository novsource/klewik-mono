import {Icons} from '@ui/icons';

const Header = () => {
  return (
    <header className="w-full h-16">
      <div className="px-4 h-full w-full flex justify-between items-center gap-x-4">
        <div className="">
          <Icons.Logo />
        </div>
      </div>
    </header>
  );
};

export default Header;
