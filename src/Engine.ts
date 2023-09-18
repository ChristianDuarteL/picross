import { Clock } from "./Clock";
import { getOrThrow } from "./utils";

export type point = [number, number];
export type dimension = [number, number];

export class Entity {
    zIndex: number;

    constructor(zIndex = 0) {
        this.zIndex = zIndex;
    }
    
    init(_game: Engine) { }
    update(_game: Engine) { }
    lateUpdate(_game: Engine) { }
    draw(_ctx: CanvasRenderingContext2D, _size: dimension, _game: Engine) { }
    keydown(_key: string, _event: KeyboardEvent, _game: Engine) { }
    mousedown(_x: number, _y: number, _event: MouseEvent, _game: Engine) { }
    mouseup(_x: number, _y: number, _event: MouseEvent, _game: Engine) { }
    mousemove(_x: number, _y: number, _event: MouseEvent, _game: Engine) { }
    resize(_width: number, _height: number, _game: Engine) { }
}

export class Engine {
    entities: Entity[];
    private entities_map: Map<string, Entity[]>;
    private clock: Clock;
    private canvas: HTMLCanvasElement;
    private canvas_ctx: CanvasRenderingContext2D;
    canvas_size: dimension;
    context: any;

    constructor(canvas: HTMLCanvasElement, context: any = {}){
        this.entities = [];
        this.entities_map = new Map();
        this.clock = new Clock(performance.now());
        this.canvas = canvas;
        this.canvas_ctx = getOrThrow(canvas.getContext('2d'));
        this.canvas_size = [ this.canvas.width, this.canvas.height ];
        this.context = Object.freeze(context);
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('mousedown', this.mousedown.bind(this));
        document.addEventListener('mouseup', this.mouseup.bind(this));
        document.addEventListener('mousemove', this.mousemove.bind(this));
    }
    
    addEntity(entity: Entity){
        if(!(entity instanceof Entity)) {
            throw Error('That element is not an Entity');
        }
        this.entities.push(entity);
        this.entities = this.entities.sort((a, b) => a.zIndex - b.zIndex);
        if(!this.entities_map.has(entity.constructor.name)){
            this.entities_map.set(entity.constructor.name, [])
        }
        this.entities_map.get(entity.constructor.name)?.push(entity);
        entity.init(this);
    }
    
    getEntitiesOfType(class_name: string){
        return this.entities_map.get(class_name);
    }
    
    getEntityOfType(class_name: string){
        return (this.entities_map.get(class_name) ?? [null]) [0] ?? null;
    }
    
    removeEntity(entity: Entity){
        const f = (e: Entity) => e !== entity; 
        const entities_class = entity.constructor.name;
        const n = this.entities_map.get(entities_class);
        n && this.entities_map.set(entities_class, n.filter(f));
        this.entities = this.entities.filter(f);
    }
    
    removeEntitiesOfType(class_name: string){
        this.entities = this.entities.filter(e => e.constructor.name == class_name);
        this.entities_map.delete(class_name);
    }
    
    doLoop(time?: number){
        time && this.clock.tick(time);
        this.update();
        this.redraw();
        requestAnimationFrame(this.doLoop.bind(this));
    }
    
    update(){
        this.entities.forEach(e => e.update(this));
        this.entities.forEach(e => e.lateUpdate(this));
    }
    
    draw(ctx: CanvasRenderingContext2D, size: dimension, game: Engine) {
        ctx.clearRect(0, 0, ...size);
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#fff';
        this.entities.forEach(e => e.draw(ctx, size, game));
    }

    redraw() {
        this.draw(this.canvas_ctx, this.canvas_size, this);
    }
    
    keydown(event: KeyboardEvent) {
        this.entities.forEach(e => e.keydown(event.key, event, this))
    }

    mousedown(event: MouseEvent) {
        const pos: point = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];
        this.entities.forEach(e => e.mousedown(...pos, event, this))
    }

    mouseup(event: MouseEvent) {
        const pos: point = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];
        this.entities.forEach(e => e.mouseup(...pos, event, this))
    }

    mousemove(event: MouseEvent) {
        const pos: point = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];
        this.entities.forEach(e => e.mousemove(...pos, event, this))
    }
    
    get deltaTime() {
        return this.clock.deltaTime;
    }
    
    setContext (value: any) {
        this.context = { ...this.context, ...value};
    }

    setSize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas_size = [width, height];
        this.entities.forEach(e => e.resize(width, height, this))
        this.redraw();
    }
}