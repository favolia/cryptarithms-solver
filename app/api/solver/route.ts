import { CryptarithmSolver } from "@/lib/cryptarithm-solver";
import { ReadableFormat, StringTransformer } from "@/lib/transformer";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export const GET = async (req: NextRequest) => {
    const params = (param: string) => req.nextUrl.searchParams.get(param);
    const words = params("words");
    const answer = params("answer");

    if (!words || !answer) {
        return NextResponse.json(
            {
                success: false,
                message: "No parameter words & answer provided!",
            },
            { status: 400 }
        );
    }

    const transformer = new StringTransformer();
    const wordsArr = transformer.setValue(words).toArray();

    if (!wordsArr) {
        return NextResponse.json(
            {
                success: false,
                message: 'Cannot convert to array! Try splitting with "-"',
            },
            { status: 200 }
        );
    }

    try {
        const solver = new CryptarithmSolver(wordsArr, answer);
        const result = solver.solve();

        if (result.length < 1) throw new Error("Solution not found.");
        const readableAnswer = ReadableFormat(result[0].words, result[0].answer)

        return NextResponse.json({
            success: true,
            message: "Solution found!",
            readable_answer: readableAnswer,
            single_answer: result[0],
            result,
        }, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
};
