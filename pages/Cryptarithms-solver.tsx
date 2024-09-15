// SlotManagerComponent.tsx
"use client";
import React, { Fragment, useState } from 'react';
import { useWordStore } from '@/stores/slotWordStore';
import { useAnswerStore } from '@/stores/slotAnswerStore';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import SimpleTooltip from '@/components/ui/simple-tooltip';
import SparklesText from '@/components/magicui/sparkles-text';
import { ModeToggle } from '@/components/theme-toggle';
import { REGEXP_ONLY_CHARS } from 'input-otp';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import DotPattern from '@/components/magicui/dot-pattern';
import { cn } from '@/lib/utils';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { TiInfoLarge } from "react-icons/ti";
import { BsCopy } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { VscDiffAdded, VscRemove } from "react-icons/vsc";
import { PiRowsPlusBottomLight } from "react-icons/pi";
import { TbRowRemove } from "react-icons/tb";

import { MAX_COLUMNS, MAX_ROWS } from '@/config/constants';
import { solve } from '@/lib/solve';
import { toast } from 'sonner';
import BlurFade from '@/components/magicui/blur-fade';
import { ReadableFormat } from '@/lib/transformer';
import Footer from '@/components/component/Footer/footer';

const CryptarithmsSolver: React.FC = () => {
    const [hideGUI, setHideGUI] = useState<boolean>(false);
    const [solved, setSolved] = useState<{ words: string[], answer: string }[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { rowWords, addRow, removeRow, addColumn, removeColumn } = useWordStore((state) => ({
        rowWords: state.rowWords,
        addRow: state.addRow,
        removeRow: state.removeRow,
        addColumn: state.addColumn,
        removeColumn: state.removeColumn
    }));

    const { rowAnswerLength, addColumnAnswer, removeColumnAnswer } = useAnswerStore((state) => ({
        rowAnswerLength: state.rowAnswerLength,
        addColumnAnswer: state.addColumnAnswer,
        removeColumnAnswer: state.removeColumnAnswer
    }));

    const totalLengthFromZero = rowWords.reduce((sum, word) => sum + word.length, 0) + rowAnswerLength;

    const FormSchema = z.object({
        pin: z.string().min(totalLengthFromZero, {
            message: "Fill every column!",
        }),
    });

    const getSlotIndex = (rowIndex: number, colIndex: number) => {
        let index = 0;
        for (let i = 0; i < rowIndex; i++) {
            index += rowWords[i].length;
        }
        return index + colIndex;
    };

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "SHESAYYES",
        }
    });

    const onSubmit = async (event: { pin: string }) => {
        setIsLoading(true)

        const loadingToast = toast.loading("Try to solve your problem... kidding.");
        const inputString = String(event.pin).toUpperCase();

        const words: string[] = [];
        let currentIndex = 0;

        rowWords.forEach(row => {
            words.push(inputString.slice(currentIndex, currentIndex + row.length));
            currentIndex += row.length;
        });

        const wordAnswer = inputString.slice(currentIndex);

        // fetch
        const answer = await solve(words, wordAnswer)

        if (answer.success) {
            setIsLoading(false)
            setSolved(answer.result)

            // toast.success(JSON.stringify(answer.result), { id: loadingToast })
            const infoToast = toast.info("Scroll down for more solutions.", {
                duration: 120000,
                important: true,
                id: loadingToast,
                description: answer.readable_answer,
                icon: (
                    <BsCopy onClick={() => {
                        navigator.clipboard.writeText(answer.readable_answer);
                        toast.success(answer.readable_answer + " Copied!");
                        toast.dismiss(infoToast);
                    }} className="mx-1 cursor-pointer" />
                )
            });
        } else {
            setIsLoading(false)
            toast.success(answer.message), { id: loadingToast }
        }
    }

    return (
        <main className="min-h-screen w-full overflow-hidden bg-background">
            <div className="relative min-h-screen w-full overflow-hidden bg-background">

                <header className="relative h-[10vh] w-full flex justify-between items-center px-8 sm:px-12 pt-6 z-50">
                    <SparklesText onClick={() => setHideGUI(prev => !prev)} className="text-base sm:text-xl" text="Cryptarithms Solver" colors={{ first: "#ffffff", second: "#252525" }} />
                    <div className="flex justify-center items-center gap-x-2">
                        <SimpleTooltip text={"What is Cryptarithm?"} pClassName={"text-xs"}>
                            <Link href={"https://en.wikipedia.org/wiki/Verbal_arithmetic"} target="_blank" className={buttonVariants({ size: "icon", variant: "ghost" })}>
                                <TiInfoLarge size={20} />
                            </Link>
                        </SimpleTooltip>
                        <ModeToggle />
                    </div>
                </header>

                <div className={`${(rowWords.some(row => row.length > 8) || rowAnswerLength > 8)
                    ? "scale-[0.65]"
                    : (rowWords.some(row => row.length > 6) || rowAnswerLength > 6)
                        ? "scale-[0.7]"
                        : (rowWords.some(row => row.length > 4) || rowAnswerLength > 4)
                            ? "scale-90"
                            : ""
                    } ${rowWords.length > 4 && !(rowWords.some(row => row.length > 4) || rowAnswerLength > 4)
                        ? "scale-90"
                        : ""} md:scale-100 xl:scale-110 relative flex flex-col justify-center items-center select-none h-[80vh] w-full z-20`}>

                    <div className="relative">

                        <Form {...form}>
                            <form className="flex items-end justify-center relative" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputOTP
                                                    inputMode="text"
                                                    containerClassName="flex-col items-end z-30"
                                                    pattern={REGEXP_ONLY_CHARS}
                                                    maxLength={totalLengthFromZero}
                                                    {...field}
                                                >
                                                    {rowWords.map((val, rowIndex) => (
                                                        <Fragment key={rowIndex}>
                                                            <InputOTPGroup>
                                                                {[...Array(val.length)].map((_, colIndex) => {
                                                                    const index = getSlotIndex(rowIndex, colIndex);
                                                                    return <InputOTPSlot className={hideGUI ? "!bg-transparent !border-none" : ""} key={index} index={index} />;
                                                                })}
                                                            </InputOTPGroup>
                                                        </Fragment>
                                                    ))}

                                                    <div className="w-full flex items-center -translate-x-4">
                                                        <span><IoIosAdd size={20} /></span>
                                                        <Separator className="!bg-black dark:!bg-white" />
                                                    </div>

                                                    <InputOTPGroup>
                                                        {[...Array(rowAnswerLength)].map((_, answerIndex) => {
                                                            const index = rowWords.reduce((sum, word) => sum + word.length, 0) + answerIndex;
                                                            return <InputOTPSlot className={hideGUI ? "!bg-transparent !border-none" : ""} key={index} index={index} />;
                                                        })}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button disabled={isLoading} type="submit" className={`${hideGUI && "hidden"} z-10 absolute -bottom-16`}>
                                    Solve
                                </Button>
                            </form>
                        </Form>

                        <div className={`${hideGUI && "hidden"} absolute w-full h-full top-0`}>
                            <div className="flex justify-between gap-y-2">
                                {/* Remove columns & row */}
                                <div>
                                    <SimpleTooltip asChild pClassName={"text-xs"} text="Remove row">
                                        <Button
                                            disabled={rowWords.length < 3 || isLoading}
                                            onClick={() => { removeRow(); form.reset({ pin: "" }) }}
                                            variant="outline"
                                            className="h-10 w-10 absolute -top-14 -left-10 rounded-md z-10 cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
                                        >
                                            <TbRowRemove />
                                        </Button>
                                    </SimpleTooltip>

                                    <div className="flex flex-col absolute -left-14 gap-y-2">
                                        {rowWords.map((row, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-col items-center">
                                                {/* Tombol Remove Column untuk baris tertentu */}
                                                <SimpleTooltip asChild text={`Remove column from row ${rowIndex + 1}`}>
                                                    <Button
                                                        disabled={rowWords[rowIndex].length < 2 || isLoading}
                                                        onClick={() => { removeColumn(rowIndex); form.reset({ pin: "" }) }}
                                                        variant="outline"
                                                        className="h-10 w-10 rounded-md z-10 cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
                                                    >
                                                        <VscRemove />
                                                    </Button>
                                                </SimpleTooltip>
                                            </div>
                                        ))}
                                    </div>

                                    <SimpleTooltip asChild text="Remove column answer">
                                        <Button
                                            disabled={rowAnswerLength < 2 || isLoading}
                                            onClick={() => { removeColumnAnswer(); form.reset({ pin: "" }) }}
                                            variant="outline"
                                            className="h-10 w-10 absolute -left-14 bottom-0 rounded-md z-10 cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
                                        >
                                            <VscRemove />
                                        </Button>
                                    </SimpleTooltip>
                                </div>

                                {/* Add columns & row */}
                                <div>
                                    <SimpleTooltip asChild text="Add row">
                                        <Button
                                            disabled={rowWords.length >= MAX_ROWS || isLoading}
                                            onClick={() => { addRow(); form.reset({ pin: "" }) }}
                                            variant="outline"
                                            className="h-10 w-10 absolute -top-14 rounded-md z-10 cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
                                        >
                                            <PiRowsPlusBottomLight />
                                        </Button>
                                    </SimpleTooltip>

                                    <div className="flex flex-col absolute -right-14 gap-y-2">
                                        {rowWords.map((row, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-col items-center">
                                                <SimpleTooltip asChild text={`Add column to row ${rowIndex + 1}`}>
                                                    <Button
                                                        disabled={rowWords[rowIndex].length >= MAX_COLUMNS || isLoading}
                                                        onClick={() => { addColumn(rowIndex); form.reset({ pin: "" }) }}
                                                        variant="outline"
                                                        className="h-10 w-10 rounded-md z-10 cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
                                                    >
                                                        <VscDiffAdded />
                                                    </Button>
                                                </SimpleTooltip>
                                            </div>
                                        ))}
                                    </div>

                                    <SimpleTooltip asChild text="Add column answer">
                                        <Button
                                            disabled={rowAnswerLength >= MAX_COLUMNS || isLoading}
                                            onClick={() => { addColumnAnswer(); form.reset({ pin: "" }) }}
                                            variant="outline"
                                            className="h-10 w-10 absolute -right-14 bottom-0 rounded-md z-10 cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
                                        >
                                            <VscDiffAdded />
                                        </Button>
                                    </SimpleTooltip>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <DotPattern
                    className={cn(` ${hideGUI ? "opacity-20" : "animate-pulse"} [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]`)}
                />

            </div>

            {/* Result */}
            <div className={`${(!solved) && "hidden"} flex flex-col w-full justify-center items-center pb-20`}>

                {solved && (
                    <SparklesText className="text-lg sm:text-2xl" text="Solutions" colors={{ first: "#ffffff", second: "#252525" }} />
                )}

                <div className="flex flex-col justify-center items-center mt-10">
                    {solved?.map((entry, index) => (
                        <div key={index} className="h-10 flex gap-x-2 justify-center items-center w-80 mb-2">
                            {solved.length <= 150 ? (
                                <BlurFade className="min-w-10 h-full" delay={0.10} inView>
                                    <div className={`size-full border-input border-2 rounded-md flex justify-center items-center ${index >= 999 ? 'text-xs' : 'text-sm'}`}>
                                        {index + 1}
                                    </div>
                                </BlurFade>
                            ) : (
                                <div className="min-w-10 h-full">
                                    <div className={`size-full border-input border-2 rounded-md flex justify-center items-center ${index >= 999 ? 'text-xs' : 'text-sm'}`}>
                                        {index + 1}
                                    </div>
                                </div>
                            )}
                            {solved.length <= 150 ? (
                                <BlurFade className="w-full" delay={0.10} inView>
                                    <Button
                                        onClick={() => {
                                            toast.dismiss();
                                            const infoResultToast = toast.info(
                                                ReadableFormat(entry.words, entry.answer),
                                                {
                                                    duration: 3000,
                                                    important: true,
                                                    icon: (
                                                        <BsCopy
                                                            onClick={() => {
                                                                // handleConfetti();
                                                                navigator.clipboard.writeText(
                                                                    ReadableFormat(entry.words, entry.answer)
                                                                );
                                                                toast.success(
                                                                    ReadableFormat(entry.words, entry.answer) + " Copied!"
                                                                );
                                                                toast.dismiss(infoResultToast);
                                                            }}
                                                            className="ml-2 cursor-pointer"
                                                        />
                                                    ),
                                                }
                                            );
                                        }}
                                        className="w-full justify-start font-mono"
                                        variant="secondary"
                                    >
                                        {entry.words.join(" + ")} = {entry.answer}
                                    </Button>
                                </BlurFade>
                            ) : (
                                <Button
                                    onClick={() => {
                                        toast.dismiss();
                                        const infoResultToast = toast.info(
                                            ReadableFormat(entry.words, entry.answer),
                                            {
                                                duration: 3000,
                                                important: true,
                                                icon: (
                                                    <BsCopy
                                                        onClick={() => {
                                                            // handleConfetti();
                                                            navigator.clipboard.writeText(
                                                                ReadableFormat(entry.words, entry.answer)
                                                            );
                                                            toast.success(
                                                                ReadableFormat(entry.words, entry.answer) + " Copied!"
                                                            );
                                                            toast.dismiss(infoResultToast);
                                                        }}
                                                        className="ml-2 cursor-pointer"
                                                    />
                                                ),
                                            }
                                        );
                                    }}
                                    className="w-full justify-start font-mono"
                                    variant="secondary"
                                >
                                    {entry.words.join(" + ")} = {entry.answer}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {/* Footer */}
            <Footer hideGUI={hideGUI} solved={solved} />

        </main>
    );
};

export default CryptarithmsSolver;
