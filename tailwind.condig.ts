// @ts-nocheck
import type { Config } from 'tailwindcss'
import { green, grass, mauve } from '@radix-ui/colors'

const config: Config = {
    content: ['./**/*.vue'],
    theme: {
        extend: {
            colors: {
                ...mauve,
                ...green,
                ...grass,
            },
        },
    },
    plugins: [],
}

export default config
