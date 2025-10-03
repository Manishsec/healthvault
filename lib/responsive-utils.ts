/**
 * Responsive utility functions and constants for HealthVault
 */

// Breakpoint constants that match Tailwind CSS defaults
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Mobile-first media queries
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  'mobile-only': `(max-width: ${BREAKPOINTS.md - 1}px)`,
  'tablet-up': `(min-width: ${BREAKPOINTS.sm}px)`,
  'desktop-up': `(min-width: ${BREAKPOINTS.lg}px)`,
} as const

// Responsive class utilities
export const RESPONSIVE_CLASSES = {
  // Container spacing
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  
  // Grid layouts
  gridCols: {
    responsive2: 'grid-cols-1 sm:grid-cols-2',
    responsive3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    responsive4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    autoFit: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  },
  
  // Flex layouts
  flexResponsive: 'flex-col sm:flex-row',
  flexCenter: 'flex flex-col items-center sm:flex-row sm:justify-center',
  flexBetween: 'flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0',
  
  // Text sizes
  textSizes: {
    hero: 'text-3xl sm:text-4xl md:text-6xl lg:text-7xl',
    heading: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    subheading: 'text-xl sm:text-2xl md:text-3xl',
    body: 'text-base sm:text-lg',
    caption: 'text-sm sm:text-base',
  },
  
  // Spacing
  spacing: {
    section: 'py-12 sm:py-16 md:py-20 lg:py-24',
    element: 'space-y-4 sm:space-y-6 md:space-y-8',
    gap: 'gap-4 sm:gap-6 md:gap-8',
  },
  
  // Button sizes
  buttonSizes: {
    responsive: 'text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3',
    large: 'text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4',
  },
} as const

// Hook for checking if device is mobile
export function useIsMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < BREAKPOINTS.md
}

// Utility function to combine responsive classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Helper function for responsive grid columns based on item count
export function getResponsiveGridCols(itemCount: number): string {
  if (itemCount <= 1) return 'grid-cols-1'
  if (itemCount <= 2) return RESPONSIVE_CLASSES.gridCols.responsive2
  if (itemCount <= 3) return RESPONSIVE_CLASSES.gridCols.responsive3
  return RESPONSIVE_CLASSES.gridCols.responsive4
}

// Helper function for responsive card layouts
export function getCardLayoutClasses(variant: 'default' | 'compact' | 'feature' = 'default'): string {
  const baseClasses = 'transition-all duration-300 hover:shadow-lg'
  
  switch (variant) {
    case 'compact':
      return cn(baseClasses, 'p-4 sm:p-6')
    case 'feature':
      return cn(baseClasses, 'p-6 sm:p-8 hover:scale-[1.02]')
    default:
      return cn(baseClasses, 'p-6')
  }
}

// Helper for responsive image sizes
export function getImageSizeClasses(size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  const sizes = {
    sm: 'w-8 h-8 sm:w-10 sm:h-10',
    md: 'w-12 h-12 sm:w-16 sm:h-16',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32',
  }
  return sizes[size]
}
