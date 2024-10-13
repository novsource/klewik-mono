import {useLocation} from 'react-router-dom';
import {cn} from '../../../utils/cn';
import {Icons} from '../icons';
import {ReactNode, useEffect, useMemo} from 'react';
import {paths} from '../../../router/paths';

type DashboardMenuProps = {
  className: string;
};

const DashboardMenu = ({className}: DashboardMenuProps) => {
  const {pathname} = useLocation();

  useEffect(() => {
    console.log(pathname);
  }, []);

  const menuItems = useMemo(() => {
    return paths.reduce<ReactNode[]>((acc, curr) => {
      const menuIcon = {
        '/wheel': <Icons.Home width={21} height={21} />,
        '/donations': <Icons.Money width={21} height={21} />,
        '/settings': <Icons.Settings width={21} height={21} />,
        '/slots': <Icons.List width={21} height={21} />,
      }[curr.path];

      const isCurrentItemInPathname = pathname.includes(curr.path);
      const menuItem = (
        <li
          key={curr.path}
          className={cn(isCurrentItemInPathname && 'text-gray-accent')}>
          {menuIcon}
        </li>
      );

      acc.push(menuItem);

      return acc;
    }, []);
  }, [pathname]);

  return (
    <nav className={cn(className)}>
      <div className="py-5 px-4 rounded-medium bg-dark border-dark">
        <ul className="flex flex-col gap-y-7 text-gray [&>li]:cursor-pointer [&>li:hover]:text-gray-accent [&>li]:transition-all">
          {menuItems}
        </ul>
      </div>
    </nav>
  );
};

export default DashboardMenu;
