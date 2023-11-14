/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts, css}"],
  theme: {
    extend: {
      gradientColorStops: {
        'blue-light': '#87CEEB',
        'blue-dark': '#ADD8E6',
        'brown-light': '#D2B48C', // Light brown
        'brown-medium': '#8B4513', // Medium brown
        'brown-dark': '#3E2723', // Dark brown
      },
},
  },
  plugins: [],
}

