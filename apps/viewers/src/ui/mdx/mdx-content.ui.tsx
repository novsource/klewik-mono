import { useMDXComponent } from "next-contentlayer2/hooks"
import { mdxComponents } from "./mdx-components.ui"

export type MDXContentProps = {
  code: string
}

export const MDXContent = (props: MDXContentProps) => {
  const {code} = props

  const Content = useMDXComponent(code)

  return <Content components={mdxComponents} code={ code } />
}
