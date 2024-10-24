import {Icons} from '@ui/icons';

const WelcomePage = () => {
  return (
    <>
      <main className="h-full w-full">
        <div className="w-full h-full flex flex-row">
          <div className="h-full w-full basis-1/3 min-w-[400px] max-w-[520px]">
            <div className="h-full w-full px-10">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="mt-5">
                  <button className="py-2 px-4 w-full font-medium text-body bg-yellow bg-opacity-30 text-yellow rounded-medium flex gap-x-2 items-center justify-center">
                    <Icons.Face
                      width={18}
                      height={18}
                      className="text-yellow"
                    />
                    Прочитать перед использованием
                  </button>
                </div>
                <div className="flex flex-col gap-y-6 mb-32">
                  <Icons.Logo width={46} height={46} />
                  <div className="flex flex-col gap-y-2">
                    <h1 className="font-bold text-[24px] leading-7">
                      Добро пожаловать в поинтовый аукцион!
                    </h1>
                    <h4 className="font-medium text-body text-gray">
                      Для продолжения выберите действие
                    </h4>
                  </div>

                  <div className="flex gap-y-3 flex-col w-full">
                    <button className="py-3 bg-green text-body font-medium rounded-medium hover:bg-opacity-80 transition-all flex gap-x-1 items-center justify-center">
                      <Icons.Login width={24} height={24} />
                      Войти в аукцион
                    </button>
                    <button className="bg-dark py-3 text-body font-medium rounded-medium text-gray-accent hover:bg-opacity-80 transition-all flex gap-x-1 items-center justify-center leading-3">
                      <Icons.Plus width={24} height={24} />
                      Создать аукцион
                    </button>
                  </div>
                </div>
                <div className="mb-5">
                  <a
                    href="https://www.github.com"
                    target="_blank"
                    className="flex gap-x-2 hover:text-white transition-all text-gray-accent items-center">
                    <Icons.Github width={18} height={18} />
                    <span className="font-medium text-body">Github</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-full border-l-[1px] border-dark flex-grow">
            Animation
          </div>
        </div>
      </main>
    </>
  );
};

export default WelcomePage;
