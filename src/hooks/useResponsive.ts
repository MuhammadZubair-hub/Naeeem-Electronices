import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ResponsiveData {
  width: number;
  height: number;
  isTablet: boolean;
  isPhone: boolean;
  orientation: 'portrait' | 'landscape';
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const useResponsive = (): ResponsiveData => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  
  const isTablet = width >= breakpoints.md;
  const isPhone = width < breakpoints.md;
  const orientation = width > height ? 'landscape' : 'portrait';

  return {
    width,
    height,
    isTablet,
    isPhone,
    orientation,
    breakpoints,
  };
};

/**
 * Hook for responsive font sizes
 */
export const useResponsiveFonts = () => {
  const { width, isTablet } = useResponsive();
  
  const getFontSize = (baseSize: number): number => {
    if (isTablet) {
      return baseSize * 1.2;
    }
    return baseSize;
  };

  return {
    getFontSize,
    isTablet,
  };
};

/**
 * Hook for responsive spacing
 */
export const useResponsiveSpacing = () => {
  const { width, isTablet } = useResponsive();
  
  const getSpacing = (baseSpacing: number): number => {
    if (isTablet) {
      return baseSpacing * 1.5;
    }
    return baseSpacing;
  };

  return {
    getSpacing,
    isTablet,
  };
};

/**
 * Hook for responsive grid columns
 */
export const useResponsiveGrid = () => {
  const { width, isTablet } = useResponsive();
  
  const getColumns = (baseColumns: number): number => {
    if (width >= breakpoints.xl) {
      return Math.min(baseColumns + 2, 6);
    } else if (width >= breakpoints.lg) {
      return Math.min(baseColumns + 1, 5);
    } else if (isTablet) {
      return baseColumns;
    } else {
      return Math.max(baseColumns - 1, 1);
    }
  };

  return {
    getColumns,
    isTablet,
  };
};
