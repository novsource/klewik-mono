import {Icons} from '../icons';

const Header = () => {
  return (
    <header className="w-full">
      <div className="w-full p-4">
        <div className="flex w-full justify-between items-center gap-x-4">
          <div className="">
            <Icons.Logo />
          </div>
          <div className="">Logo</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
