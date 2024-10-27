import { Icons } from '@ui/icons'
import CloverAnimation from './components/CloverAnimation/CloverAnimation'

const WelcomePage = () => {
  return (
    <>
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
                <div className="flex flex-col gap-y-6 after:mb-28 after:xl:mb-36 after:2xl:mb-40">
                  <Icons.Logo width={46} height={46} />
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-titleXL font-bold leading-5 2xl:text-[24px] 2xl:leading-7">
                      Добро пожаловать в поинтовый аукцион!
                    </h1>
                    <h4 className="text-body font-medium text-gray">
                      Для продолжения выберите действие
                    </h4>
                  </div>

                  <div className="flex w-full flex-col gap-y-3">
                    <button className="flex items-center justify-center gap-x-1 rounded-medium bg-green py-2.5 text-body font-medium leading-4 transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
                      <Icons.Login width={21} height={21} />
                      Войти в аукцион
                    </button>
                    <button className="flex items-center justify-center gap-x-1 rounded-medium bg-dark py-2.5 text-body font-medium leading-4 text-gray-accent transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
                      <Icons.Plus width={21} height={21} />
                      Создать аукцион
                    </button>
                  </div>
                </div>

                <a
                  href="https://www.github.com"
                  target="_blank"
                  className="flex items-center gap-x-2 text-gray-accent transition-all after:mb-5 hover:text-white"
                >
                  <Icons.Github width={18} height={18} />
                  <span className="hidden text-title font-medium 2xl:inline-block 2xl:text-body 2xl:font-medium">
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
    </>
  )
}

export default WelcomePage
