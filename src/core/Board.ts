
type PictureMatrix = number[][];

interface IBoard{
    width: number;
    height: number;
    picture: PictureMatrix;
    getColumn: (col: number) => number[];
    getRow: (col: number) => number[];
}

class Board implements IBoard{
    width: number;
    height: number;
    picture: PictureMatrix;

    constructor(stream: number[], width: number, height: number){
        this.width = width;
        this.height = height;
        if(stream.length < width * height){
            throw Error('Width and Height lengths mismatch with stream\'s length')
        }
        this.picture = Array(width).fill(null).map(_ => stream.splice(0, this.height));
    }

    getColumn: (col: number) => number[] = (col) => {
        return Array(this.height).fill(0).map((_, i) => this.picture[col][i])
    };

    getRow: (col: number) => number[] = (row) => {
        return Array(this.width).fill(0).map((_, i) => this.picture[i][row])
    };
}