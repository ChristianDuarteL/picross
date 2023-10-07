import { GridContext } from "./canvas-interface/Grid";
import { Engine } from "./canvas-interface/Engine"
import { Board } from "./core/Board";
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
        /*board: new Board([
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
        current_board: new Board(20, 20)*/
        board: new Board([
            0,1,0,0,
            0,1,1,0,
            1,1,1,0,
            1,0,0,1,
        ], 4, 4),
        current_board: new Board(4, 4)
    })
    
    engine.addEntity(new GameGrid());
    
    engine.doLoop();
    const resizeObserver = new ResizeObserver(() => {
        engine.setSize(canvas.offsetWidth*window.devicePixelRatio, canvas.offsetHeight*window.devicePixelRatio) 
    });
    canvas.style.width = "95vw";
    canvas.style.height = "90vh";
    canvas.addEventListener("contextmenu", e => e.preventDefault());
    resizeObserver.observe(canvas);
})