type PictureMatrix = number[][];

interface IBoard{
    width: number;
    height: number;
    picture: PictureMatrix;
    getColumn: (col: number) => number[];
    getRow: (col: number) => number[];
    getColumnLabels: (col: number) => number[];
    getRowLabels: (col: number) => number[];
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

    getLabels: (stream: number[]) => number[] = (stream) => {
        const labels = [];
        let last_elem = 0;
        let count = 0;
        for (let i = 0; i < stream.length; i++) {
            const element = stream[i];
            if(element != last_elem){
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
        return labels;
    }

    getColumnLabels: (col: number) => number[] = (col) => {
        return this.getLabels(this.getColumn(col));
    };

    getRowLabels: (col: number) => number[] = (row) => {
        return this.getLabels(this.getRow(row));
    }

    getColumn: (col: number) => number[] = (col) => {
        return Array(this.height).fill(0).map((_, i) => this.picture[col][i])
    };

    getRow: (col: number) => number[] = (row) => {
        return Array(this.width).fill(0).map((_, i) => this.picture[i][row])
    };
}