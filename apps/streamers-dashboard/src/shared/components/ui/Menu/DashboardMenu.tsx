import {cn} from '../../../utils/cn';
import {Icons} from '../icons';

type DashboardMenuProps = {
  className: string;
};

const DashboardMenu = ({className}: DashboardMenuProps) => {
  return (
    <nav className={cn(className)}>
      <div className="py-5 px-4 rounded-medium bg-dark border-dark">
        <ul className="flex flex-col gap-y-7 text-gray [&>li]:cursor-pointer [&>li:hover]:text-gray-accent [&>li]:transition-all">
          <li>
            <Icons.Home width={21} height={21} />
          </li>
          <li>
            <Icons.List width={21} height={21} />
          </li>
          <li>
            <Icons.Money width={21} height={21} />
          </li>
          <li>
            <Icons.Settings width={21} height={21} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DashboardMenu;
