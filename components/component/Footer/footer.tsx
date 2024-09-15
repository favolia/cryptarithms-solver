import { Separator } from "@/components/ui/separator";
import SimpleTooltip from "@/components/ui/simple-tooltip";
import { GitHubLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import React from 'react'

const Footer = ({ hideGUI, solved }: { hideGUI: boolean, solved: { words: string[], answer: string }[] | null }) => {
    return (
        <div className={`${hideGUI && "invisible"} ${!solved && "absolute bottom-0"} h-[10vh] w-full flex gap-4 justify-between items-center px-8 sm:px-12`}>
            <p className="text-[0.65rem] sm:text-xs text-muted-foreground">© {new Date().getFullYear()} Cryptarithms Solver</p>
            <div className="flex justify-center items-center gap-x-3">
                <SimpleTooltip text={"@defavolia"} pClassName={"text-xs"}>
                    <Link href={"https://instagram.com/defavolia"} target="_blank">
                        <InstagramLogoIcon className="h-5 w-5" />
                    </Link>
                </SimpleTooltip>
                <Separator orientation="vertical" className="h-5" />
                <SimpleTooltip text={"github/favolia"} pClassName={"text-xs"}>
                    <Link href={"https://github.com/favolia"} target="_blank">
                        <GitHubLogoIcon className="h-5 w-5" />
                    </Link>
                </SimpleTooltip>
            </div>

        </div>
    )
}

export default Footer