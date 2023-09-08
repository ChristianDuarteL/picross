const rotationalClamp = (val: number, min: number, max: number) => {
    val -= min
    const diff = max - min;
    while(val < min) val += diff;
    return (val % diff) + min;
}

const getOrThrow: <T>(val: T | null | undefined) => T = <T>(val: T | null | undefined) => {
    if(!val){
        throw new TypeError('This type must not be null or undefined')
    }
    return val;
}