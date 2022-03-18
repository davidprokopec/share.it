import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "100px",
  md: "600px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",
});

const theme = extendTheme({
  colors: {
    black: "#16161D",
  },
  fonts,
  breakpoints,
  styles: {
    global: () => ({
      body: {
        minWidth: "min-content",
        bg: "gray.300",
        maxWidth: "100vw",
        overflow: "scroll",
      },
    }),
  },
});

export default theme;
