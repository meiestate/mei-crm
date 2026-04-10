import React from "react";
import useResponsive from "../../hooks/useResponsive";

type PageContainerProps = {
  children: React.ReactNode;
  maxWidth?: number | string;
  mobilePadding?: number | string;
  desktopPadding?: number | string;
  tabletPadding?: number | string;
  topPadding?: number | string;
  bottomPadding?: number | string;
  centered?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
};

export default function PageContainer({
  children,
  maxWidth = 1440,
  mobilePadding = 12,
  tabletPadding = 16,
  desktopPadding = 20,
  topPadding,
  bottomPadding,
  centered = true,
  fullWidth = false,
  style,
}: PageContainerProps) {
  const { isMobile, isTablet } = useResponsive();

  const horizontalPadding = isMobile
    ? mobilePadding
    : isTablet
    ? tabletPadding
    : desktopPadding;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: fullWidth ? "100%" : maxWidth,
        margin: centered ? "0 auto" : undefined,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: topPadding ?? horizontalPadding,
        paddingBottom: bottomPadding ?? horizontalPadding,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}