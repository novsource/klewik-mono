import Link from 'next/link'
import { Divider } from 'klewik-ui/divider'
import { Icons } from 'klewik-ui/icons'
import { cn } from '~utils/cn'
import { ComponentProps } from 'react'

export type AppHeaderProps = HeaderProps

export const AppHeader = (props: AppHeaderProps) => {
  const { className, ...restProps } = props

  return (
    <Header
      className={cn(
        'border-b-dark-light border-b-1 bg-dark-foreground/30 backdrop-blur-sm sticky top-0',
        className,
      )}
      {...restProps}
    >
      <div className="container h-full w-full">
        <div className="relative flex h-full w-full items-center justify-between gap-x-4 tablet:px-4 py-2">
          <Icons.Logo className="text-green-accent" size="lg" />
          <div className="flex h-full items-center">
            <Link
              className="flex items-center gap-x-1.5 text-sm font-medium text-gray-light hover:text-dark-white transition-colors hover:underline underline-offset-5"
              href="/docs"
              target="_blank"
            >
              Документация
              <Icons.LinkArrow size="xs" />
            </Link>
            <Divider className="mx-4" orientation="vertical" />
            <Link
              className="flex items-center text-gray-light hover:text-dark-white size-6 transition-colors"
              href="https://github.com/novsource/klewik-viewers"
            >
              <Icons.Github size="sm" />
            </Link>
          </div>
        </div>
      </div>
    </Header>
  )
}

type HeaderProps = ComponentProps<'header'>

function Header(props: HeaderProps) {
  const { children, className, ...restProps } = props

  return (
    <header className={cn('z-10 h-fit w-full', className)} {...restProps}>
      {children}
    </header>
  )
}
