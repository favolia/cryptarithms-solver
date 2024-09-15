export class CryptarithmSolver {
    private words: string[];
    private result: string;
    private uniqueChars: string[];
    private firstLetters: Set<string>;
    private solutions: { words: string[]; answer: string }[];

    constructor(words: string[], result: string) {
        this.words = words;
        this.result = result;
        this.uniqueChars = [...new Set(words.join('') + result)];
        this.firstLetters = new Set(words.map(word => word[0]).concat(result[0]));
        this.solutions = [];

        if (this.uniqueChars.length > 10) {
            throw new Error('Too many unique characters');
        }
    }

    private isValidAssignment(assignment: Record<string, number>): boolean {
        const getNumber = (word: string): number => parseInt([...word].map(char => assignment[char] || 0).join(''), 10);
        const sum = this.words.reduce((acc, word) => acc + getNumber(word), 0);
        return sum === getNumber(this.result);
    }

    private assignDigits(chars: string[], usedDigits: boolean[] = new Array(10).fill(false), assignment: Record<string, number> = {}): void {
        if (chars.length === 0) {
            if (this.isValidAssignment(assignment)) {
                const formattedWords = this.words.map(word => this.formatWord(word, assignment));
                const formattedAnswer = this.formatWord(this.result, assignment);
                this.solutions.push({
                    words: formattedWords,
                    answer: formattedAnswer
                });
            }
            return;
        }

        const currentChar = chars[0];
        for (let digit = 0; digit <= 9; digit++) {
            if (!usedDigits[digit] && (digit !== 0 || !this.firstLetters.has(currentChar))) {
                assignment[currentChar] = digit;
                usedDigits[digit] = true;

                // Recursion for the next character
                this.assignDigits(chars.slice(1), usedDigits, assignment);

                // Undo assignment for backtrack
                usedDigits[digit] = false;
                delete assignment[currentChar];
            }
        }
    }

    private formatWord(word: string, assignment: Record<string, number>): string {
        return parseInt([...word].map(char => assignment[char] || 0).join(''), 10).toString();
    }

    public solve(): { words: string[]; answer: string }[] {
        this.assignDigits(this.uniqueChars);
        return this.solutions;  // Return all valid solutions
    }
}