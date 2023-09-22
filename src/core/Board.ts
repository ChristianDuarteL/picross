export type PictureMatrix = number[][];

export interface IBoard{
    width: number;
    height: number;
    picture: PictureMatrix;
    getColumn: (col: number) => number[];
    getRow: (col: number) => number[];
    getColumnLabels: (col: number) => number[];
    getRowLabels: (col: number) => number[];
    compareTo: (value: PictureMatrix | IBoard) => boolean;
}

export interface BoardLabels{
    rows: number[][];
    cols: number[][];
}

export class Board implements IBoard{
    width: number;
    height: number;
    picture: PictureMatrix;

    constructor(width: number, height: number);
    constructor(stream: number[], width: number, height: number);

    constructor(...args: [ number, number ] | [ number[], number, number ]){
        this.width = args.length == 2 ? args[0] : args[1];
        this.height = args.length == 2 ? args[1] : args[2];
        if(args.length == 2){
            this.picture = Array(this.height).fill(null).map(_ => Array(this.width).fill(0))
        }else{
            if(args[0].length < this.width * this.height){
                throw Error('Width and Height lengths mismatch with stream\'s length')
            }
            this.picture = Array(this.height).fill(null).map(_ => args[0].splice(0, this.width));
        }
    }

    getLabels: (stream: number[]) => number[] = (stream) => {
        const labels = [];
        let last_elem = stream[0];
        let count = last_elem == 0 ? 0 : 1;
        for (let i = 1; i < stream.length; i++) {
            const element = stream[i];
            if(element != last_elem){
                last_elem = element;
                if(count){
                    labels.push(count);
                }
                count = element ? 1 : 0;
                continue;
            }
            if(element != 0){
                count++;
            }
        }
        if(count || labels.length == 0) labels.push(count);
        return labels;
    }

    getColumnLabels: (col: number) => number[] = (col) => {
        return this.getLabels(this.getColumn(col));
    };

    getRowLabels: (row: number) => number[] = (row) => {
        return this.getLabels(this.getRow(row));
    }

    getAllLabels: () => BoardLabels = () => {
        return {
            cols: Array(this.width).fill(0).map((_, i) => this.getColumnLabels(i)),
            rows: Array(this.height).fill(0).map((_, i) => this.getRowLabels(i))
        };
    }

    getColumn: (col: number) => number[] = (col) => {
        if(col >= this.width || col < 0){
            throw new RangeError('The column must be between 0 and ' + this.width)
        }
        return Array(this.height).fill(0).map((_, i) => this.picture[i][col])
    };

    getRow: (row: number) => number[] = (row) => {
        if(row >= this.height || row < 0){
            throw new RangeError('The column must be between 0 and ' + this.height)
        }
        return Array(this.width).fill(0).map((_, i) => this.picture[row][i])
    };

    get: (col: number, row: number) => number = (col, row) => {
        return this.picture[row][col]
    }

    compareTo: (value: PictureMatrix | IBoard) => boolean = (v) => {
        v = Array.isArray(v) ? v : v.picture;
        if(this.picture.length !== v.length) return false;
        for (let i = 0; i < this.picture.length; i++) {
            if(this.picture[i].length !== v[i].length) return false;
            for (let j = 0; j < this.picture[i].length; j++) {
                if(this.picture[i][j] !== v[i][j]) return false;
            }
        }
        return true;
    }
}