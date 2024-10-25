import { Icons } from '@ui/icons'

const WelcomePage = () => {
  return (
    <>
      <main className="h-full w-full">
        <div className="flex h-full w-full flex-row">
          <div className="h-full w-full min-w-[400px] max-w-[600px] basis-1/3">
            <div className="h-full w-full px-10">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="mt-5">
                  <button className="flex w-full items-center justify-center gap-x-2 rounded-medium bg-yellow bg-opacity-30 px-4 py-2 text-body font-medium text-yellow">
                    <Icons.Face
                      width={18}
                      height={18}
                      className="text-yellow"
                    />
                    Прочитать перед использованием
                  </button>
                </div>
                <div className="mb-32 flex flex-col gap-y-6">
                  <Icons.Logo width={46} height={46} />
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-[24px] font-bold leading-7">
                      Добро пожаловать в поинтовый аукцион!
                    </h1>
                    <h4 className="text-body font-medium text-gray">
                      Для продолжения выберите действие
                    </h4>
                  </div>

                  <div className="flex w-full flex-col gap-y-3">
                    <button className="flex items-center justify-center gap-x-1 rounded-medium bg-green py-3 text-body font-medium transition-all hover:bg-opacity-80">
                      <Icons.Login width={24} height={24} />
                      Войти в аукцион
                    </button>
                    <button className="flex items-center justify-center gap-x-1 rounded-medium bg-dark py-3 text-body font-medium leading-3 text-gray-accent transition-all hover:bg-opacity-80">
                      <Icons.Plus width={24} height={24} />
                      Создать аукцион
                    </button>
                  </div>
                </div>
                <div className="mb-5">
                  <a
                    href="https://www.github.com"
                    target="_blank"
                    className="flex items-center gap-x-2 text-gray-accent transition-all hover:text-white"
                  >
                    <Icons.Github width={18} height={18} />
                    <span className="text-body font-medium">Github</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-full flex-grow border-l-[1px] border-dark">
            Animation
          </div>
        </div>
      </main>
    </>
  )
}

export default WelcomePage
