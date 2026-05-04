// Khayyat design system
export const theme = {
  colors: {
    bg: '#FAF6F0',
    bgAlt: '#F3ECE0',
    surface: '#FFFFFF',
    primary: '#7C2D5C',        // deep plum/rose - feminine premium
    primaryDark: '#5C1F44',
    primarySoft: '#FBE9F1',
    accent: '#C9A96E',          // warm gold
    accentSoft: '#F5EBD7',
    text: '#1F1A24',
    textMuted: '#6B6471',
    border: '#EBE3D6',
    success: '#0F766E',
    warn: '#B45309',
    danger: '#BE123C',
  },
  radius: { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 },
  shadow: {
    soft: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
  },
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
};
