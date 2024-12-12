import { Icons } from '@ui/icons'
import CloverAnimation from './components/CloverAnimation/CloverAnimation'
import { Button, Slider, Typography } from '@ui/index'
import {
  SliderAdminContent,
  SliderCreateContent,
  SliderRolesContent,
  SliderSuccessContent,
  SliderWelcomeContent,
} from './components/SliderContents'

const WelcomePage = () => {
  return (
    <main className="h-full w-full">
      <div className="flex h-full w-full flex-row">
        <div className="flex-shrink-1 mx-auto h-full flex-grow max-tablet:container max-tablet:max-w-[650px]">
          <div className="h-full w-full px-5 desktop:px-8 desktopLg:px-10">
            <div className="flex h-full w-full flex-col justify-between">
              <div className="mt-5">
                <Button
                  className="w-full bg-yellow bg-opacity-40 text-yellow hover:bg-opacity-30 tablet:text-nowrap"
                  startContent={<Icons.Warning size="default" />}
                >
                  Прочитать перед использованием!
                </Button>
              </div>

              <Slider
                className="flex min-h-[400px] flex-col gap-y-6 transition-[height]"
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
              </Slider>

              <a
                href="https://www.github.com"
                target="_blank"
                className="mb-5 flex w-fit items-center gap-x-2 text-gray-accent transition-all hover:text-white"
              >
                <Icons.Github size="lg" />
                <Typography
                  tag="span"
                  className="hidden desktopLg:inline-block desktopLg:text-md desktopLg:font-medium"
                >
                  Github
                </Typography>
              </a>
            </div>
          </div>
        </div>
        <div className="hidden h-full w-full flex-shrink-[2] flex-grow basis-2/3 border-l-[1px] border-dark bg-[#111] landtop:block">
          <CloverAnimation />
        </div>
      </div>
    </main>
  )
}

export default WelcomePage
