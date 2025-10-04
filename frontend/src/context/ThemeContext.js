// Dark mode removed. This file is kept to avoid breaking imports, but no-op exports are provided.
export const useTheme = () => ({ isDarkMode: false, toggleDarkMode: () => {} });
export const ThemeProvider = ({ children }) => children;
