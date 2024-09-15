export class StringTransformer {
    private value: string;

    constructor() {
        this.value = '';
    }

    setValue(val: string): this {
        this.value = val;
        return this;
    }

    isArray(): boolean {
        return this.value.includes("-");
    }

    toArray(): string[] | null {
        return this.isArray() ? this.value.split("-") : null;
    }

    getValue(): string {
        return this.value;
    }
}

export const ReadableFormat = (words: string[], answer: string) => {
    const leftTerms = words.map(word => word.trim().toUpperCase());
    const rightTerm = answer.trim().toUpperCase();
    return `${leftTerms.join(' + ')} = ${rightTerm}`
}

// Usage
// const transformer = new StringTransformer();
// const result = transformer.setValue("a-b-c").toArray();
// console.log(result); // ["a", "b", "c"]

// const result2 = transformer.setValue("abc").toArray();
// console.log(result2); // null

