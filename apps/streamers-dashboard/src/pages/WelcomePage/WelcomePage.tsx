import { Icons } from '@ui/icons'
import CloverAnimation from './components/CloverAnimation/CloverAnimation'
import { Slider } from '@ui/index'
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
        <div className="flex-shrink-1 container mx-auto h-full flex-grow xl:max-w-[550px]">
          <div className="h-full w-full px-5 xl:px-8 2xl:px-10">
            <div className="flex h-full w-full flex-col justify-between">
              <div className="mt-5">
                <button className="flex w-full items-center justify-center gap-x-1 rounded-medium bg-yellow bg-opacity-40 px-4 py-2.5 text-body font-medium text-yellow hover:bg-opacity-30 md:text-nowrap xl:py-2">
                  <Icons.Warning width={18} height={18} />
                  Прочитать перед использованием!
                </button>
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
                <Icons.Github width={24} height={24} />
                <span className="hidden text-title 2xl:inline-block 2xl:text-body 2xl:font-medium">
                  Github
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="hidden h-full w-full flex-shrink-[2] flex-grow basis-2/3 border-l-[1px] border-dark bg-[#111] xl:block">
          <CloverAnimation />
        </div>
      </div>
    </main>
  )
}

export default WelcomePage
