export class PositiveNumber {
    constructor(readonly value: number) {
        checkIsAssigned(value);
        checkIsPositive(value);
    }
}

export let checkIsPositive = (n: number) => {
    if (n < 0) {
        throw new Error(`Number is '${n}' but required to be >= 0`);
    }
};

export let checkIsAssigned = (value: any) => {
    if (value == null) {
        throw new Error('Value is required');
    }
};

export let checkArraySizeIsMax = (array: any[], expectedSize: number) => {
    if (array.length > expectedSize) {
        throw new Error(`Expected size is max '${expectedSize}' but is actually '${array.length}'`);
    }
};

export let checkArrayIsNotEmpty = (array: any[]) => {
    if (array.length  === 0) {
        throw new Error('Array is empty but required to be non-empty');
    }
};