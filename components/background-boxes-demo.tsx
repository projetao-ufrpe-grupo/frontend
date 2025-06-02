"use client"
import { Boxes } from "@/components/ui/background-boxes"
import { cn } from "@/lib/utils"

export default function BackgroundBoxesDemo() {
  return (
    <div className="h-full relative w-full overflow-hidden bg-slate-900 dark:bg-slate-950 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 dark:bg-slate-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <div className="relative z-20 text-center">
        <h1 className={cn("md:text-4xl text-2xl font-bold text-white mb-2")}>UniHome</h1>
        <p className="text-center mt-2 text-neutral-300 max-w-md mx-auto px-4">
          Encontre a moradia ideal próxima à sua universidade. Conectando estudantes e proprietários para uma
          experiência universitária perfeita.
        </p>
      </div>
    </div>
  )
}
