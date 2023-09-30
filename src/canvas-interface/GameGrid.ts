import { BoardLabels } from "../core/Board";
import { GameContext } from "../main";
import { Engine, dimension, point } from "./Engine";
import { Grid, GridContext } from "./Grid";
import { draw_borders } from "./utils";

export class GameGrid extends Grid {

    labels?: BoardLabels;
    max_row_labels_count?: number;
    max_col_labels_count?: number;
    
    constructor(){
        super([1, 1], [1, 1])
    }

    init(game: Engine<GameContext>): void {
        this.setSize(game.context.board.size);
        this.setSizeRatio([1, 1]);
        this.labels = game.context.board.getAllLabels();
        this.max_row_labels_count = Math.max(...this.labels.rows.map(e => e.length))
        this.max_col_labels_count = Math.max(...this.labels.cols.map(e => e.length))
    }

    selected_change_fn = (i: point, game: Engine<GameContext>, event: MouseEvent) => {
        if(!this.max_row_labels_count || !this.max_col_labels_count) return;
        game.canvas_styles.cursor = 'default';
        if(i[0] >= this.max_row_labels_count && i[1] >= this.max_col_labels_count && i[0] < this.grid_size[0] && i[1] < this.grid_size[1]){
            game.canvas_styles.cursor = 'pointer';
        }
        if(event.buttons & 1){
            game.context.current_board.set(i[0] - this.max_col_labels_count - 1, i[1] - this.max_col_labels_count, 1);
        }
    }

    click_fn = (i: point, game: Engine<GameContext>) => {
        if(!this.max_col_labels_count) return;
        game.context.current_board.set(i[0] - this.max_col_labels_count - 1, i[1] - this.max_col_labels_count, 1);
    }

    touch_fn = (i: point, game: Engine<GameContext>) => {
        if(!this.max_col_labels_count) return;
        game.context.current_board.set(i[0] - this.max_col_labels_count - 1, i[1] - this.max_col_labels_count, 1);
    }

    draw_element_fn = (ctx: CanvasRenderingContext2D, i: point, pos: point, size: dimension, game: Engine<GameContext & GridContext>) => {
        if(!this.max_row_labels_count || !this.max_col_labels_count || !this.labels) return;
        ctx.strokeStyle = "#666";
        if(i[0] >= this.max_row_labels_count && i[1] >= this.max_col_labels_count){
            draw_borders(ctx, pos, size, 1);
            if(game.context.selected_tile && game.context.selected_tile[0] == i[0] && game.context.selected_tile[1] == i[1]){
                ctx.fillStyle = "#ff07";
                ctx.fillRect(...pos, ...size);
            }
            if(game.context.current_board.get(i[0] - this.max_col_labels_count - 1, i[1] - this.max_col_labels_count )){
                ctx.fillStyle = "#fff";
                ctx.fillRect(...pos, ...size);
            }
            return;
        }
        

        if(i[0] < this.max_row_labels_count && i[1] < this.max_col_labels_count) return;

        const is_row = i[0] < this.max_row_labels_count;
        let labels_arr = is_row ? this.labels.rows[i[1] - this.max_col_labels_count] : this.labels.cols[i[0] - this.max_row_labels_count];
        
        if(!labels_arr) return;
        let label = is_row ? labels_arr[i[0] - (this.max_row_labels_count - labels_arr.length)] : labels_arr[i[1] - (this.max_col_labels_count - labels_arr.length)];
        
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
    };

}