import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
	return (
		<div className="flex flex-col h-full font-[family-name:var(--font-golos-text)] pb-4">
			<main className="relative flex h-full flex-col font-[family-name:var(--font-golos-text)] items-center">
				<div className="absolute top-1/3 –translate-y-1/3 flex flex-col gap-y-5 items-start">
					<div className="flex flex-col gap-y-6 items-start">
						<Image src="/logo.svg" width={42} height={42} priority alt="logo" />
						<h1 className="text-[2.5rem] font-extrabold leading-9">
							Ошибка - 404
						</h1>
					</div>

					<div className="flex flex-col gap-y-0.5">
						<h2 className="font-bold text-title-xl text-white leading-7">
							Страница, на которую вы пытались перейти, не найдена
						</h2>
						<p className="text-title font-light text-white/60">
							Проверьте уникальный идентификатор (номер) аукциона, если вы
							собирались перейти на страницу с аукционом
						</p>
					</div>
				</div>
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<Link
					className="text-md text-white/80 hover:text-white hover:underline hover:underline-offset-4 transition-all"
					href="#"
				>
					Пользовательское соглашение
				</Link>
				<a
					className="flex gap-x-1.5 text-md text-white/80 hover:text-white hover:underline hover:underline-offset-4 transition-all"
					href="http://localhost:5173"
				>
					<Image
						src="/linkArrow.svg"
						width={14}
						height={14}
						alt="arrow svg icon"
					/>
					Перейти на основной сайт
				</a>
			</footer>
		</div>
	)
}
