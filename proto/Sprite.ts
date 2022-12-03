import Canvas = require('./../Canvas');
import IMG = require('./IMG');
import Resources = require('../Resources');

/** @constant instance de Canvas */
const canvas = Canvas.getInstance();

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant les sprites pour les objets Drawable
*/
class Sprite {
  /** la position X du pixel supérieur gauche */
  private x: number;
  /** la position Y du pixel supérieur gauche */
  private y: number;
  /** la position X du pixel inférieur droit */
  private endX: number;
  /** la position Y du pixel inférieur droit */
  private endY: number;
  /** la longueur du côté X */
  private sideX: number;
  /** la longueur du côté Y */
  private sideY: number;
  /** la largeur du sprite */
  private width: number;
  /** la hauteur du sprite */
  private height: number;
  /** l'image du sprite */
  private image: IMG;
  /** le nombre de frames du sprite */
  private frames: number;
  /** la frame actuelle */
  private currentFrame: number;
  /** la vitesse de transition des frames */
  private speed: number;
  /** le scale du sprite */
  private scale: number;
  /** l'avancement des update du sprite */
  private tick: number;
  /** la fonction qui se lance lorsque le Sprite subit un double-clic */
  private onDoubleClick: any;

  /**
   * @method constructor
   * @param  image       le nom de l'image
   * @param  x           la position en X
   * @param  y           la position en Y
   * @param  speed       la vitesse
   * @param  scale       le scale
   */
  public constructor(image: string, x: number, y: number, speed: number, scale: number) {
    this.image = Resources.getImage(image);
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.scale = scale;
    this.width = this.image.getWidth() * this.scale;
    this.height = this.image.getHeight() * this.scale;
    this.frames = this.image.getFrames();
    this.currentFrame = 0;
    this.tick = 0;
    this.endX = this.x + this.width;
    this.endY = this.y + this.height;
    this.sideX = this.endX - this.x;
    this.sideY = this.endY - this.y;
  }

  /**
   * Dessine le sprite sur le canvas
   * @method draw
   */
  public draw(): void {
    if(this.image.isLoaded()) {
      canvas.CTX.drawImage(
        this.image.getImage(),
        this.currentFrame * this.width / this.scale,
        0,
        this.width / this.scale,
        this.height / this.scale,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  /**
   * Mets à jour le sprite
   * @method update
   * @param  x        la nouvelle position X
   * @param  y        la nouvelle position Y
   */
  public update(x: number, y: number, progress: number): void {
    if(x !== 0) this.x = x;
    if(y !== 0) this.y = y;
    this.setEndX(this.x + this.width);
    this.setEndY(this.y + this.height);
    this.tick++;
    if (this.frames > 1) {
      if (this.tick === this.speed) {
        this.tick = 0;
        this.currentFrame++;
        if (this.currentFrame >= this.frames) {
          this.currentFrame = 0;
        }
      }
    }
  }

  /**
   * Vérifie si les coordonnées X et Y se trouvent sous le sprite
   * @method isIn
   * @param  x    la coordonnée X
   * @param  y    la coordonnée Y
   * @return      si la coordonnée est en dessus ou non
   */
  public isIn(x: number, y: number): boolean {
    return (x >= this.x + canvas.OFFSETLEFT && y >= this.y + canvas.OFFSETTOP &&
      x < this.x + this.width + canvas.OFFSETLEFT && y < this.y + this.height + canvas.OFFSETTOP);
  }

  public getX(): number { return this.x };
  public getY(): number { return this.y };
  public getEndX(): number { return this.endX };
  public getEndY(): number { return this.endY };
  public getSideX(): number { return this.sideX };
  public getSideY(): number { return this.sideY };
  public getHeight(): number { return this.height };
  public getWidth(): number { return this.width };
  public getImage(): IMG { return this.image };
  public getFrames(): number { return this.frames };
  public getCurrentFrame(): number { return this.currentFrame };
  public getSpeed(): number { return this.speed };
  public getScale(): number { return this.scale };
  public getTick(): number { return this.tick };
  public getOnDoubleClick(): any { return this.onDoubleClick };

  public setX(x: number): Sprite  { this.x = x; return this; };
  public setY(y: number): Sprite  { this.y = y; return this; };
  public setEndX(endX: number): Sprite  { this.endX = endX; return this; };
  public setEndY(endY: number): Sprite  { this.endY = endY; return this; };
  public setSideX(sideX: number): Sprite  { this.sideX = sideX; return this; };
  public setSideY(sideY: number): Sprite { this.sideY = sideY; return this; };
  public setHeight(height: number): Sprite  { this.height = height; return this; };
  public setWidth(width: number): Sprite  { this.width = width; return this; };
  public setImage(image: IMG): Sprite  { this.image = image; return this; };
  public setFrames(frames: number): Sprite  { this.frames = frames; return this; };
  public setCurrentFrame(currentFrame: number): Sprite  { this.currentFrame = currentFrame; return this; };
  public setSpeed(speed: number): Sprite  { this.speed = speed; return this; };
  public setScale(scale: number): Sprite  { this.scale = scale; return this; };
  public setTick(tick: number): Sprite  { this.tick = tick; return this; };
  public setOnDoubleClick(onDoubleClick: any): Sprite { this.onDoubleClick = onDoubleClick; return this; };
}

export = Sprite;
