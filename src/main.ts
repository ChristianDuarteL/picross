import { Grid, GridContext } from "./canvas-interface/Grid";
import { Engine, dimension } from "./canvas-interface/Engine"
import { Board, BoardLabels } from "./core/Board";
import { draw_borders } from "./canvas-interface/utils";
import { GameGrid } from "./canvas-interface/GameGrid";

export interface GameContext {
    board: Board,
    current_board: Board,
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('game_canvas');
    if(!(canvas instanceof HTMLCanvasElement))
        return;
    

    const engine = new Engine<GameContext & GridContext>(canvas, {
        board: new Board([
            0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,
            0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,
            0,0,0,0,0,1,1,1,1,0,0,1,0,0,1,1,1,0,0,0,
            0,0,0,0,1,1,0,0,1,1,1,1,0,0,0,1,1,1,0,0,
            0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,
            0,1,1,1,1,0,0,0,1,1,0,1,1,0,1,1,0,0,1,1,
            1,1,0,1,1,0,0,1,1,0,0,0,1,1,1,0,0,0,1,1,
            1,0,0,0,1,1,1,1,1,0,0,0,0,1,1,0,1,1,1,1,
            1,0,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,1,
            1,1,0,1,1,0,0,0,1,1,1,1,1,0,0,1,0,0,0,1,
            0,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,0,0,1,1,
            0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,
            0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,
            0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,
            0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,
            0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,
            0,0,0,1,0,0,0,1,1,0,1,0,1,1,0,1,1,0,0,0,
            1,0,0,1,1,0,0,1,0,1,1,0,0,1,0,1,0,0,1,0,
            0,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,0,
            0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
        ], 20, 20),
        current_board: new Board(20, 20)
    })
    
    const grid = new GameGrid();
    engine.addEntity(grid);
    engine.doLoop();
    const resizeObserver = new ResizeObserver((e) => {
        engine.setSize(canvas.offsetWidth*window.devicePixelRatio, canvas.offsetHeight*window.devicePixelRatio) 
    });
    canvas.style.width = "95vw";
    canvas.style.height = "90vh";
    resizeObserver.observe(canvas);
})