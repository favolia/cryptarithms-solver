"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type SimpleTooltipProps = {
    children: React.ReactNode
    text: string
    asChild?: boolean,
    delay?: number
    pClassName?: string
}

const SimpleTooltip = ({ children, text, asChild = false, delay = 300, pClassName = "text-xs", ...props }: SimpleTooltipProps) => {
    return (
        <TooltipProvider {...props} delayDuration={delay}>
            <Tooltip>
                <TooltipTrigger asChild={asChild}>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p className={pClassName}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default SimpleTooltip