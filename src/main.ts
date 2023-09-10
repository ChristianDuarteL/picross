import { Grid } from "./Board";
import { Engine } from "./Engine"

window.addEventListener('load', () => {
    const canvas = document.getElementById('game_canvas');
    if(!(canvas instanceof HTMLCanvasElement))
        return;
    const engine = new Engine(canvas);
    const grid = new Grid([10, 10], [.9, .9]);
    grid.draw_element_fn = (ctx, i, pos, size, game) => {
        ctx.fillStyle = '#002';
        if((i[0] + i[1]) % 2 == 0){
            ctx.fillStyle = '#020';
        }
        if(game.context.selected_tile && game.context.selected_tile[0] == i[0] && game.context.selected_tile[1] == i[1]) {
            ctx.fillStyle = '#f00';
        }
        ctx.fillRect(...pos, ...size);
    }
    engine.addEntity(grid);
    engine.doLoop();
    const resizeObserver = new ResizeObserver((e) => {
        engine.setSize(canvas.offsetWidth, canvas.offsetHeight) 
    });
    canvas.style.width = "90vw";
    canvas.style.height = "90vh";
    resizeObserver.observe(canvas);
})