export type ThemeType = 'default' | 'alternative';

export interface ThemeColors {
  bgColor: string;
  overlayColor: string;
  tagBgColor: string;
  buttonBgColor: string;
  titleColor: string;
  borderColor: string;
}

export const getThemeColors = (theme: ThemeType): ThemeColors => {
  if (theme === 'default') {
    return {
      bgColor: 'bg-neutral-800/50',
      overlayColor: 'bg-black/70',
      tagBgColor: 'bg-neutral-700/50',
      buttonBgColor: 'bg-green-600 hover:bg-green-700',
      titleColor: 'text-green-500',
      borderColor: 'border-neutral-700'
    };
  } else {
    return {
      bgColor: 'bg-blue-900/50',
      overlayColor: 'bg-blue-950/70',
      tagBgColor: 'bg-blue-800/50',
      buttonBgColor: 'bg-cyan-600 hover:bg-cyan-700',
      titleColor: 'text-cyan-400',
      borderColor: 'border-blue-800'
    };
  }
}; 