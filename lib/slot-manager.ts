export class SlotManager {
    private slots: { rowWords: { length: number }[]; rowAnswerLength: number };
    private setSlots: (updater: (prev: { rowWords: { length: number }[]; rowAnswerLength: number }) => { rowWords: { length: number }[]; rowAnswerLength: number }) => void;
    private form: { reset: (values: { pin: string }) => void };
    private toast: { warning: (message: string) => void };
    private maxRows: number;
    private maxColumns: number;

    constructor(slots: { rowWords: { length: number }[]; rowAnswerLength: number }, setSlots: (updater: (prev: { rowWords: { length: number }[]; rowAnswerLength: number }) => { rowWords: { length: number }[]; rowAnswerLength: number }) => void, form: { reset: (values: { pin: string }) => void }, toast: { warning: (message: string) => void }, maxRows: number, maxColumns: number) {
        this.slots = slots;
        this.setSlots = setSlots;
        this.form = form;
        this.toast = toast;
        this.maxRows = maxRows;
        this.maxColumns = maxColumns;
    }

    addRow() {
        this.form.reset({ pin: "" });
        if (this.slots.rowWords.length < this.maxRows) {
            this.setSlots(prev => ({
                ...prev,
                rowWords: [...prev.rowWords, { length: 1 }],
            }));
        } else {
            this.toast.warning(`Cannot add more than ${this.maxRows} rows.`);
        }
    }

    removeRow() {
        this.form.reset({ pin: "" });
        if (this.slots.rowWords.length > 2) {
            this.setSlots(prev => ({
                ...prev,
                rowWords: prev.rowWords.slice(0, -1),
            }));
        } else {
            return this.toast.warning("minimum row length is 2 to perform addition.");
        }
    }

    addColumn(rowIndex: number) {
        this.form.reset({ pin: "" });
        if (this.slots.rowWords[rowIndex].length < this.maxColumns) {
            this.setSlots(prev => ({
                ...prev,
                rowWords: prev.rowWords.map((row, index) =>
                    index === rowIndex
                        ? { ...row, length: row.length + 1 }
                        : row
                ),
            }));
        } else {
            this.toast.warning(`Cannot add more than ${this.maxColumns} columns per row.`);
        }
    }

    removeColumn(rowIndex: number) {
        this.form.reset({ pin: "" });
        if (this.slots.rowWords[rowIndex].length > 1) {
            this.setSlots(prev => ({
                ...prev,
                rowWords: prev.rowWords.map((row, index) =>
                    index === rowIndex
                        ? { ...row, length: row.length - 1 }
                        : row
                ),
            }));
        }
    }

    addColumnAnswer() {
        this.form.reset({ pin: "" });
        if (this.slots.rowAnswerLength < this.maxColumns) {
            this.setSlots(prev => ({
                ...prev,
                rowAnswerLength: prev.rowAnswerLength + 1,
            }));
        } else {
            this.toast.warning(`Cannot add more than ${this.maxColumns} columns per row.`);
        }
    }

    removeColumnAnswer() {
        this.form.reset({ pin: "" });
        if (this.slots.rowAnswerLength > 1) {
            this.setSlots(prev => ({
                ...prev,
                rowAnswerLength: prev.rowAnswerLength - 1,
            }));
        }
    }
}

