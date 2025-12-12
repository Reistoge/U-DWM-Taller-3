/** @type {import('tailwindcss').Config} */
/**
 * Tailwind CSS Configuration
 * 
 * Extends the default Tailwind theme with custom animations and keyframes.
 * 
 * @typedef {Object} TailwindConfig
 * @property {string} darkMode - Enables dark mode using the "class" strategy
 * @property {string[]} content - Specifies file paths to scan for class names
 * @property {Object} theme - Theme configuration object
 * @property {Object} theme.extend - Extends default theme values
 * @property {Object} theme.extend.animation - Custom animation definitions
 * @property {string} theme.extend.animation['fade-in'] - Fade in animation (0.5s ease-in-out)
 * @property {string} theme.extend.animation['slide-up'] - Slide up animation (0.3s ease-out)
 * @property {Object} theme.extend.keyframes - Custom keyframe definitions
 * @property {Object} theme.extend.keyframes.fadeIn - Defines opacity transition from 0 to 1
 * @property {Object} theme.extend.keyframes.slideUp - Defines translateY and opacity transition
 * @property {Array} plugins - Tailwind plugins array (empty by default)
 * 
 * @usage In your HTML/JSX files, apply animations using Tailwind's animate utility:
 * - Use `animate-fade-in` class for fade in effect
 * - Use `animate-slide-up` class for slide up effect
 * 
 * @example
 * // Apply fade-in animation to an element
 * <div className="animate-fade-in">Fading in...</div>
 * 
 * // Apply slide-up animation to an element
 * <div className="animate-slide-up">Sliding up...</div>
 */
export default {
  darkMode: "class",
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
 
    },
  },
  plugins: [],
};
 
