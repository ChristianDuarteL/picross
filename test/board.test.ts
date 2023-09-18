import { expect, test } from 'vitest'
import { Board } from '../src/core/Board'

test('creates a board with width by height equals to stream length', () => {
  expect(() => new Board([0,0,0,1,1,1,0,0,0], 3, 3)).not.toThrowError();
})

test('creates a board with width greater than stream length', () => {
    expect(() => new Board([0,0,0,1,1,1,0,0,0], 11, 3)).toThrowError();
})

test('creates a board with height greater than stream length', () => {
    expect(() => new Board([0,0,0,1,1,1,0,0,0], 3, 11)).toThrowError();
})

test('creates a board with width by height less than stream length', () => {
    expect(() => new Board([0,0,0,1,1,1,0,0,0], 2, 2)).not.toThrowError();
})

test('the getColumn returns the correct column', () => {
    expect(new Board([
        0,0,0,
        1,1,1,
        0,0,0
    ], 3, 3).getColumn(0)).toStrictEqual([0, 1, 0]);
})

test('the getColumn cant get a column less than 0', () => {
    expect(() => new Board([0,0,0,1,1,1,0,0,0], 3, 3).getColumn(-1)).toThrowError(RangeError);
})

test('the getColumn cant get a column greater than length', () => {
    expect(() => new Board([0,0,0,1,1,1,0,0,0], 3, 3).getColumn(10)).toThrowError(RangeError);
})

test('the getRow returns the correct row', () => {
    expect(new Board([
        0,1,1,
        1,1,1,
        0,1,1
    ], 3, 3).getRow(0)).toStrictEqual([0, 1, 1]);
})

test('the getRow cant get a row less than 0', () => {
    expect(() => new Board([0,0,0,1,1,1,0,0,0], 3, 3).getRow(-1)).toThrowError(RangeError);
})

test('the getRow cant get a row greater than length', () => {
    expect(() => new Board([0,0,0,1,1,1,0,0,0], 3, 3).getRow(10)).toThrowError(RangeError);
})

test('the getRowLabels returns the correct labels with form _XX_XX', () => {
    expect(new Board([0,1,1,0,1,1], 6, 1).getRowLabels(0)).toStrictEqual([2, 2]);
})

test('the getRowLabels returns the correct labels with form XX_XX_', () => {
    expect(new Board([1,1,0,1,1,0], 6, 1).getRowLabels(0)).toStrictEqual([2, 2]);
})

test('the getRowLabels returns the correct labels with form _XX_XX_', () => {
    expect(new Board([0,1,1,0,1,1,0], 7, 1).getRowLabels(0)).toStrictEqual([2, 2]);
})

test('the getRowLabels returns the correct labels with form _XXXXX_', () => {
    expect(new Board([0,1,1,1,1,1,0], 7, 1).getRowLabels(0)).toStrictEqual([5]);
})

test('the getRowLabels returns the correct labels with form ______', () => {
    expect(new Board([0,0,0,0,0,0,0], 7, 1).getRowLabels(0)).toStrictEqual([0]);
})

test('the getColumnLabels returns the correct labels with form _XX_XX', () => {
    expect(new Board([0,1,1,0,1,1], 1, 6).getColumnLabels(0)).toStrictEqual([2, 2]);
})

test('the getColumnLabels returns the correct labels with form XX_XX_', () => {
    expect(new Board([1,1,0,1,1,0], 1, 6).getColumnLabels(0)).toStrictEqual([2, 2]);
})

test('the getColumnLabels returns the correct labels with form _XX_XX_', () => {
    expect(new Board([0,1,1,0,1,1,0], 1, 7).getColumnLabels(0)).toStrictEqual([2, 2]);
})

test('the getColumnLabels returns the correct labels with form _XXXXX_', () => {
    expect(new Board([0,1,1,1,1,1,0], 1, 7).getColumnLabels(0)).toStrictEqual([5]);
})

test('the getColumnLabels returns the correct labels with form ______', () => {
    expect(new Board([0,0,0,0,0,0,0], 1, 7).getColumnLabels(0)).toStrictEqual([0]);
})

test('board compareto equal boards', () => {
    expect(new Board([0,1,0,1,1,1,0,1,1], 3, 3).compareTo(new Board([0,1,0,1,1,1,0,1,1], 3, 3))).toBe(true);
})

test('board compareto different boards', () => {
    expect(new Board([0,1,0,1,1,1,0,1,1], 3, 3).compareTo(new Board([0,1,1,1,1,1,0,1,1], 2, 2))).toBe(false);
    expect(new Board([0,1,0,1,1,1,0,1,1], 3, 3).compareTo(new Board([0,1,1,1,1,1,0,1,1], 3, 3))).toBe(false);
    expect(new Board([0,1,0,1], 2, 2).compareTo(new Board([0,1,0,1,1,1,0,1,1], 3, 3))).toBe(false);
})

test('board compareto equal matrix', () => {
    expect(new Board([0,1,0,1,1,1,0,1,1], 3, 3).compareTo([
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 1]
    ])).toBe(true);
})

test('board compareto different matrix', () => {
    expect(new Board([0,1,0,1,1,1,0,1,1], 3, 3).compareTo([[0,1],[1,1]])).toBe(false);
    expect(new Board([0,1,0,1,1,1,0,1,1], 3, 3).compareTo([
        [0, 1, 0],
        [1, 1, 1],
        [1, 1, 1]
    ])).toBe(false);
    expect(new Board([0,1,0,1], 2, 2).compareTo([
        [0, 1, 0],
        [1, 1, 1],
        [1, 1, 1]
    ])).toBe(false);
})
