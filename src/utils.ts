export const rotationalClamp = (val: number, min: number, max: number) => {
    val -= min
    const diff = max - min;
    while(val < min) val += diff;
    return (val % diff) + min;
}

export const getOrThrow: <T>(val: T | null | undefined) => T = <T>(val: T | null | undefined) => {
    if(!val){
        throw new TypeError('This type must not be null or undefined')
    }
    return val;
}

export const mapArrays: <A1, A2, R>(array1: A1[], array2: A2[], predicate: (a: A1, b: A2) => R) => R[] 
    = (a, b, fn) => a.map((e, i) => fn(e, b[i]));
