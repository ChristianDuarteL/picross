class Entity {
    zIndex: number;

    constructor(zIndex = 0) {
        this.zIndex = zIndex;
    }
    
    init(game: Game) { }
    update(game: Game) { }
    lateUpdate(game: Game) { }
    draw(ctx: CanvasRenderingContext2D, size: [number, number], game: Game) { }
    keydown(key: string, event: KeyboardEvent, game: Game) { }
    mousedown(x: number, y: number, event: MouseEvent, game: Game) { }
    mouseup(x: number, y: number, event: MouseEvent, game: Game) { }
    mousemove(x: number, y: number, event: MouseEvent, game: Game) { }
}

class Game {
    entities: Entity[];
    private entities_map: Map<string, Entity[]>;
    private clock: Clock;
    private canvas: HTMLCanvasElement;
    private canvas_ctx: CanvasRenderingContext2D;
    canvas_size: [number, number];
    context: any;

    constructor(canvas: HTMLCanvasElement, context: any){
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
    
    removeEntitiesOfType(class_name){
        this.entities = this.entities.filter(e => e.constructor.name == class_name);
        this.entities_map.delete(class_name);
    }
    
    doLoop(time: number){
        time && this.clock.tick(time);
        this.update();
        this.draw(this.canvas_ctx, this.canvas_size, this);
        requestAnimationFrame(this.doLoop.bind(this));
    }
    
    update(){
        this.entities.forEach(e => e.update(this));
        this.entities.forEach(e => e.lateUpdate(this));
    }
    
    draw(ctx: CanvasRenderingContext2D, size: [number, number], game: Game) {
        ctx.clearRect(0, 0, ...this.canvas_size);
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        this.entities.forEach(e => e.draw(ctx, this.canvas_size, this));
    }
    
    keydown(event: KeyboardEvent) {
        this.entities.forEach(e => e.keydown(event.key, event, this))
    }

    mousedown(event: MouseEvent) {
        const pos: [number, number] = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];
        this.entities.forEach(e => e.mousedown(...pos, event, this))
    }

    mouseup(event: MouseEvent) {
        const pos: [number, number] = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];
        this.entities.forEach(e => e.mouseup(...pos, event, this))
    }

    mousemove(event: MouseEvent) {
        const pos: [number, number] = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];
        this.entities.forEach(e => e.mousemove(...pos, event, this))
    }
    
    get deltaTime() {
        return this.clock.deltaTime;
    }
    
    setContext (v) {
        this.context = { ...this.context, ...v};
    }
}