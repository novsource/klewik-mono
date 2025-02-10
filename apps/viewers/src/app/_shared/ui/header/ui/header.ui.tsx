import Image from "next/image";
import { ComponentProps } from "react";

const Header = ({ children, ...otherProps }: ComponentProps<"header">) => {
  return (
    <header className="h-16 w-full" {...otherProps}>
      <div className="flex h-full w-full items-center justify-between gap-x-4 px-4">
        <Image
          alt="Logo"
          src={"/logo.svg"}
          className="text-green-accent"
          width={28}
          height={28}
          priority
        />
        {children}
      </div>
    </header>
  );
};

export default Header;
