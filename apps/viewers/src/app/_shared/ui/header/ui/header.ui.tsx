import Image from "next/image";
import { ComponentProps } from "react";

const Header = ({ children, ...otherProps }: ComponentProps<"header">) => {
  return (
    <header className="h-14 w-full" {...otherProps}>
      <div className="container flex h-full w-full items-center justify-between gap-x-4 mx-auto">
        <Image
          alt="Logo"
          src={"/logo.svg"}
          className="text-green-accent"
          width={21}
          height={21}
          priority
        />
        {children}
      </div>
    </header>
  );
};

export default Header;
