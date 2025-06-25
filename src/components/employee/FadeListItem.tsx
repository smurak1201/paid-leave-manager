import React from "react";

export const FadeListItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({
  children,
  ...rest
}) => {
  return <li {...rest}>{children}</li>;
};
