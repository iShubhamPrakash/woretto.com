"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  gradientFrom?: string
  gradientTo?: string
  className?: string
  children: React.ReactNode
}

export function GradientButton({
  gradientFrom = "from-purple-500",
  gradientTo = "to-blue-500",
  className,
  children,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-lg p-[2px] transition-all hover:scale-105",
        className
      )}
      {...props}
    >
      <div className={cn("absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r", gradientFrom, gradientTo)} />
      <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[6px] bg-slate-950/90 px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </div>
    </Button>
  )
}

