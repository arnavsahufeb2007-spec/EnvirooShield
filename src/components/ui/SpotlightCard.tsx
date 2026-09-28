'use client';

import React, { useRef, useState, useCallback } from 'react';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children elements to render inside the card (interactive links, buttons, text, etc.)
   */
  children?: React.ReactNode;
  /**
   * Additional Tailwind or CSS class names to apply to the root card container
   */
  className?: string;
  /**
   * The color of the radial spotlight gradient.
   * Accepts any valid CSS color string (e.g. 'rgba(255, 255, 255, 0.15)', '#38bdf8', 'rgba(56, 189, 248, 0.25)').
   * Defaults to 'rgba(255, 255, 255, 0.15)' for dark variant and 'rgba(0, 0, 0, 0.08)' for light variant.
   */
  spotlightColor?: string;
  /**
   * The radial spotlight radius size in pixels.
   * @default 350
   */
  spotlightSize?: number;
  /**
   * Whether to render an illuminated 1px border glow under the cursor.
   * @default true
   */
  borderSpotlight?: boolean;
  /**
   * Optional custom color for the 1px border glow.
   * Defaults to spotlightColor if provided, otherwise variant-appropriate accent.
   */
  borderSpotlightColor?: string;
  /**
   * Visual theme variant for the card base styling.
   * @default 'dark'
   */
  variant?: 'light' | 'dark';
}

/**
 * SpotlightCard
 *
 * A reusable React / Next.js card component featuring:
 * 1. Cursor coordinate tracking (`clientX`, `clientY`) relative to the card.
 * 2. Radial spotlight overlay fading in on hover.
 * 3. Illuminated 1px border glow under the cursor using CSS `mask-image` and inset `box-shadow`.
 * 4. Smooth Tailwind opacity transitions (`transition-opacity duration-300`).
 * 5. Full support for dark/light variants, custom classes, refs, and clickable children.
 */
export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      children,
      className = '',
      spotlightColor,
      spotlightSize = 350,
      borderSpotlight = true,
      borderSpotlightColor,
      variant = 'dark',
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      style,
      ...restProps
    },
    forwardedRef
  ) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Merge forwardedRef with internal cardRef
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    // Track mouse coordinates relative to the card container on mouse move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      onMouseMove?.(e);
    };

    // Track mouse coordinates and activate spotlight on mouse enter
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    // Deactivate spotlight on mouse leave
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    // Variant default colors
    const defaultSpotlightColor =
      variant === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
    const effectiveSpotlightColor = spotlightColor ?? defaultSpotlightColor;

    const defaultBorderColor =
      variant === 'dark' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.2)';
    const effectiveBorderColor = borderSpotlightColor ?? (spotlightColor ?? defaultBorderColor);

    // Variant base styling
    const variantClasses =
      variant === 'dark'
        ? 'bg-neutral-900/90 text-neutral-100 border-neutral-800'
        : 'bg-white/90 text-neutral-900 border-neutral-200';

    return (
      <div
        ref={setRefs}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 ${variantClasses} ${className}`}
        style={style}
        {...restProps}
      >
        {/* Radial Spotlight Overlay */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${effectiveSpotlightColor}, transparent 80%)`,
          }}
          aria-hidden="true"
        />

        {/* Illuminated 1px Border Glow Overlay */}
        {borderSpotlight && (
          <div
            className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              boxShadow: `inset 0 0 0 1px ${effectiveBorderColor}`,
              WebkitMaskImage: `radial-gradient(${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 80%)`,
              maskImage: `radial-gradient(${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 80%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Card Content - Keep pointer events active and stacked above background */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = 'SpotlightCard';

export default SpotlightCard;
