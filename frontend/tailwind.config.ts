import colors from 'tailwindcss/colors';
import type { Config } from "tailwindcss";

export default {
   content: ["./app/**/*.{js,jsx,ts,tsx}"],
   theme: {
    extend: {
        colors: {
            sky: colors.sky,
            cyan: colors.cyan,
        },
    },
},
   plugins: [],
} satisfies Config;
