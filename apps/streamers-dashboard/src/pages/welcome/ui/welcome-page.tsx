import { CloverAnimation } from '~widgets/big-clover-animation/ui'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Slider } from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

import {
  SliderAdminContent,
  SliderCreateContent,
  SliderGuestContent,
  SliderRolesContent,
  SliderSuccessContent,
  SliderWelcomeContent,
} from './slider-content'

const WelcomePage = () => {
  return (
    <main className="h-full w-full">
      <div className="flex h-full w-full flex-row">
        <div className="mx-auto h-full grow basis-1/4 landtop:min-w-[450px] landtop:basis-1/5 container max-w-[650px]">
          <div className="h-full w-full px-5 desktop:px-8 desktop-lg:px-10">
            <div className="relative flex h-full w-full flex-col justify-between">
              <div className="mt-5">
                <Button
                  className="w-full bg-yellow/40 text-yellow hover:bg-yellow/30 tablet:text-nowrap"
                  startContent={<Icons.Warning size="default" />}
                >
                  Прочитать перед использованием!
                </Button>
              </div>

              <Slider
                className="absolute w-full top-[43%] -translate-y-[43%] flex flex-col gap-y-6 transition-[height] text-ti"
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
                <SliderGuestContent />
              </Slider>

              <a
                href="https://www.github.com"
                target="_blank"
                className="mb-5 flex w-fit items-center gap-x-2 text-gray-accent transition-all hover:text-white"
              >
                <Icons.Github size="lg" />
                <Typography
                  tag="span"
                  className="hidden desktop-lg:inline-block desktop-lg:text-md desktop-lg:font-medium"
                >
                  Github
                </Typography>
              </a>
            </div>
          </div>
        </div>
        <div className="hidden h-full w-full flex-shrink-2 grow basis-2/3 border-l-[1px] border-dark bg-[#111] landtop:block">
          <CloverAnimation />
        </div>
      </div>
    </main>
  )
}

export default WelcomePage
