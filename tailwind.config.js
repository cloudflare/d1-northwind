const colors = require("tailwindcss/colors");

module.exports = {
    //mode: "jit",
    content: ["./app/*.js", "./app/*.jsx", "./app/*.html"],
    theme: {
        extend: {
            colors: {
                sky: colors.sky,
                cyan: colors.cyan,
            },
        },
    },
    variants: {},
    plugins: [],
};
