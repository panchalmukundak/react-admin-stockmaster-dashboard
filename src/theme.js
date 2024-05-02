import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
// color default = light
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#f0f0f0",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#121212",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e4eff7",
          200: "#bcd8ec",
          300: "#94c1e1",
          400: "#6caad6",
          500: "#4493cb",
          600: "#2e739b",
          700: "#1f5472",
          800: "#12364a",
          900: "#071722"
        },
        orangeAccent: {
          100: "#fddfcc",
          200: "#fcbf99",
          300: "#fa9f67",
          400: "#f97f34",
          500: "#f75f01",
          600: "#c64c01",
          700: "#943901",
          800: "#632600",
          900: "#311300"
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // manually changed
          500: "#121212",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#071722",
          200: "#12364a",
          300: "#1f5472",
          400: "#2e739b",
          500: "#4493cb",
          600: "#6caad6",
          700: "#94c1e1",
          800: "#bcd8ec",
          900: "#e4eff7",
        },
        orangeAccent: {
          100: "#311300",
          200: "#632600",
          300: "#943901",
          400: "#c64c01",
          500: "#f75f01",
          600: "#f97f34",
          700: "#fa9f67",
          800: "#fcbf99",
          900: "#fddfcc",
        }
      }),
});

// mui theme settings
export const themeSettings = (mode) => {

  const colors = tokens(mode);
  const borderFocusColor = mode === "dark" ? colors.primary[400] : colors.primary[300]; // Cor da borda roxa quando focado
  //const borderFocusColor = "purple";

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.orangeAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[900],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 16,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 44,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 36,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 28,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 22,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 18,
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: borderFocusColor, // Cor da borda
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: borderFocusColor, // Cor da borda ao passar o mouse
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: borderFocusColor, // Cor da bordaquando focado
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: borderFocusColor, // Cor do label quando focado
            },
            "& .MuiFormHelperText-root.Mui-focused": {
              color: borderFocusColor, // Cor do texto de ajuda quando focado
            },
          },
        },
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};