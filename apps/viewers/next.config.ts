import type { NextConfig } from 'next'

import { withContentlayer } from 'next-contentlayer2'

const nextConfig: NextConfig = {
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	reactStrictMode: true,
	swcMinify: true,
}

export default withContentlayer(nextConfig)
