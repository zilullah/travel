"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered";
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "bg-white rounded-[23px] overflow-hidden transition-all duration-300";

  const variantStyles = {
    default: "border border-[#BAE6FD] shadow-md hover:shadow-xl",
    elevated: "border border-[#BAE6FD] shadow-lg hover:shadow-2xl",
    bordered: "border border-[#BAE6FD] shadow-sm hover:shadow-md",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div className={`relative overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div className={`p-6 flex-1 flex flex-col justify-between space-y-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div className={`pt-4 border-t border-[#EFF8FF] ${className}`} {...props}>
    {children}
  </div>
);
