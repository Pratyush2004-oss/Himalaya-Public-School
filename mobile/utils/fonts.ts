import { TextStyle } from "react-native";

// Font utility helper for consistent font usage
export const fonts = {
  outfit: {
    light: {
      fontFamily: "Outfit-Light",
    } as TextStyle,
    regular: {
      fontFamily: "Outfit-Regular",
    } as TextStyle,
    medium: {
      fontFamily: "Outfit-Medium",
    } as TextStyle,
    semibold: {
      fontFamily: "Outfit-SemiBold",
    } as TextStyle,
    bold: {
      fontFamily: "Outfit-Bold",
    } as TextStyle,
    extrabold: {
      fontFamily: "Outfit-ExtraBold",
    } as TextStyle,
  },
};

// Font weight mappings for easier usage
export const fontWeights = {
  light: "Outfit-Light",
  normal: "Outfit-Regular",
  medium: "Outfit-Medium",
  semibold: "Outfit-SemiBold",
  bold: "Outfit-Bold",
  extrabold: "Outfit-ExtraBold",
} as const;

// Helper function to get font family by weight
export const getFontFamily = (weight: keyof typeof fontWeights = "normal") => {
  return fontWeights[weight];
};
