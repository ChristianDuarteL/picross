import { Grid, GridContext } from "./Grid";
import { Engine, dimension } from "./Engine"
import { Board, BoardLabels } from "./core/Board";
import { draw_borders } from "./utils";

window.addEventListener('load', () => {
    const canvas = document.getElementById('game_canvas');
    if(!(canvas instanceof HTMLCanvasElement))
        return;
    
    interface GameContext {
        board: Board,
        current_board: Board,
    }

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
    
    const labels = engine.context.board.getAllLabels() as BoardLabels;
    const max_row_labels_count = Math.max(...labels.rows.map(e => e.length))
    const max_col_labels_count = Math.max(...labels.cols.map(e => e.length))
    
    const grid = new Grid([20 + max_row_labels_count, 20 + max_col_labels_count], [.9, .9]);
    
    grid.selected_change_fn = (i, grid, game: Engine<GameContext>, event) => {
        game.canvas_styles.cursor = 'default';
        if(i[0] >= max_row_labels_count && i[1] >= max_col_labels_count && i[0] < grid.grid_size[0] && i[1] < grid.grid_size[1]){
            game.canvas_styles.cursor = 'pointer';
        }
        if(event.buttons & 1){
            game.context.current_board.set(i[0] - max_col_labels_count - 1, i[1] - max_col_labels_count, 1);
        }
    }

    grid.click_fn = (i, grid, game: Engine<GameContext>, event) => {
        game.context.current_board.set(i[0] - max_col_labels_count - 1, i[1] - max_col_labels_count, 1);
    }

    grid.draw_element_fn = (ctx, i, pos, size, game: Engine<GameContext & GridContext>) => {
        ctx.strokeStyle = "#666";
        if(i[0] >= max_row_labels_count && i[1] >= max_col_labels_count){
            draw_borders(ctx, pos, size, 1);
            if(game.context.selected_tile && game.context.selected_tile[0] == i[0] && game.context.selected_tile[1] == i[1]){
                ctx.fillStyle = "#ff07";
                ctx.fillRect(...pos, ...size);
            }
            if(game.context.current_board.get(i[0] - max_col_labels_count - 1, i[1] - max_col_labels_count )){
                ctx.fillStyle = "#fff";
                ctx.fillRect(...pos, ...size);
            }
            return;
        }
        

        if(i[0] < max_row_labels_count && i[1] < max_col_labels_count) return;

        const is_row = i[0] < max_row_labels_count;
        let labels_arr = is_row ? labels.rows[i[1] - max_col_labels_count] : labels.cols[i[0] - max_row_labels_count];
        
        if(!labels_arr) return;
        let label = is_row ? labels_arr[i[0] - (max_row_labels_count - labels_arr.length)] : labels_arr[i[1] - (max_col_labels_count - labels_arr.length)];
        
        if(is_row) {
            draw_borders(ctx, pos, size, [1, 0]);
        }else{
            draw_borders(ctx, pos, size, [0, 1]);
        }
        
        ctx.fillStyle = '#fff';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${size[1]*.6}px sans-serif`;
        ctx.fillText(label?.toString() ?? '', ...(pos.map((e, i) => e + size[i] / 2) as dimension));
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