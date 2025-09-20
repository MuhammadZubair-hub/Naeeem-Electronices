import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { lightTheme, darkTheme, Theme } from '../styles/theme';

export const useTheme = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  
  const theme: Theme = isDarkMode ? darkTheme : lightTheme;
  
  return { theme, isDarkMode };
};
