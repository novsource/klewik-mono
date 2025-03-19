import { useRef } from 'react'

import { CloverAnimation } from '~widgets/big-clover-animation/ui'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Slider } from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import {
  SliderAdminContent,
  SliderCreateContent,
  SliderGuestContent,
  SliderRolesContent,
  SliderSuccessContent,
  SliderWelcomeContent,
} from './slider-content'
import { SliderAuctionParametersContent } from './slider-content/slider-parameters-content'

const WelcomePage = () => {
  const isCloverCanBeSafefullyRendering = useRef(
    !!HTMLCanvasElement.prototype.transferControlToOffscreen &&
      !navigator.userAgent.includes('Firefox')
  )

  return (
    <main className="h-full w-full">
      <div className="flex h-full w-full flex-row">
        <div
          className={cn(
            'mx-auto h-full grow landtop:min-w-[450px] container',
            isCloverCanBeSafefullyRendering.current &&
              'landtop:basis-1/5 basis-1/4 max-w-[650px]',
            !isCloverCanBeSafefullyRendering.current && 'max-w-[1200px]'
          )}
        >
          <div className="h-full w-full px-5 desktop:px-8 desktop-lg:px-10">
            <div className="relative grid grid-rows-slider h-full w-full grid-cols-1 justify-between">
              <div className="mt-5">
                <Button
                  className="w-full bg-yellow/40 text-yellow hover:bg-yellow/30 tablet:text-nowrap"
                  startContent={<Icons.Warning size="default" />}
                >
                  Прочитать перед использованием!
                </Button>
              </div>

              <div className="relative h-full w-full overflow-scroll">
                <Slider
                  className="slider"
                  defaultKey="welcome"
                  keys={[
                    'welcome',
                    'guest',
                    'admin',
                    'create',
                    'roles',
                    'successCreate',
                  ]}
                >
                  <SliderWelcomeContent />
                  <SliderRolesContent />
                  <SliderAdminContent />
                  <SliderCreateContent />
                  <SliderSuccessContent />
                  <SliderAuctionParametersContent />
                  <SliderGuestContent />
                </Slider>
              </div>

              <div className="py-4">
                <a
                  href="https://www.github.com"
                  target="_blank"
                  className="flex w-fit items-center gap-x-2 text-gray-accent transition-all hover:text-white"
                >
                  <Icons.Github
                    size="sm"
                    className="text-gray-light hover:text-gray-accent transition-colors"
                  />
                  <Typography
                    tag="span"
                    className="hidden desktop-lg:inline-block desktop-lg:text-md desktop-lg:font-medium font-golos-f"
                  >
                    Github
                  </Typography>
                </a>
              </div>
            </div>
          </div>
        </div>
        {isCloverCanBeSafefullyRendering.current && (
          <div className="hidden h-full w-full flex-shrink-2 grow basis-2/3 border-l-[1px] border-dark bg-[#111] landtop:block">
            <CloverAnimation />
          </div>
        )}
      </div>
    </main>
  )
}

export default WelcomePage
