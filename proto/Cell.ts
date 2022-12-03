import Sprite = require('./Sprite');

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe représentant une cellule
 * @extends Sprite
 */

class Cell extends Sprite {
  /** le Sprite en foreground */
  private sprite: Sprite;
  /** si la cellule est le point de départ du parcours */
  private start: boolean;
  /** si la cellule est le point d'arrivée du parcours */
  private end: boolean;
  /** si la cellule n'est pas franchissable */
  private wall: boolean;
  /** si la cellule doit être franchie */
  private mandatory: boolean;
  /** si la cellule possède un sprite (hors background) */
  private drawn: boolean;
  /** l'offset en X du Sprite en foreground */
  private offsetX: number;
  /** l'offset en Y du Sprite en foreground */
  private offsetY: number;

  /**
   * @method constructor
   * @param  image       l'image
   * @param  x           la position en X du pixel supérieur gauche
   * @param  y           la position Y du pixel supérieur gauche
   * @param  sideX       la largeur de la cellule
   * @param  sideY       la longueur de la cellule
   */

  /**
   * @method constructor
   * @param image         l'image
   * @param x             la position en X du pixel supérieur gauche
   * @param y             la position Y du pixel supérieur gauche
   * @param scale         le scale
   */
  public constructor(image: string, x: number, y: number, scale: number) {
    super(image, x, y, 0, scale);
  }

  /**
   * Mets à jour les Sprites des backgrounds et le sprite de la cellule
   * @method update
   * @param  x        la position x
   * @param  y        la position y
   * @param  progress le timestamp pour l'affichage
   */
  public update(x: number, y: number, progress: number): void {
    super.update(x, y, progress);
    if (this.sprite && x && y) this.sprite.update(x+this.offsetX, y+this.offsetY, progress) 
    else if (this.sprite) this.sprite.update(super.getX()+this.offsetX, super.getY()+this.offsetY, progress);
  }

  /**
   * Dessine les Sprites de la cellule
   * @method draw
   */
  public draw(): void {
    super.draw();
    if (this.sprite) this.sprite.draw();
  }

  /**
   * Controle si la cellule a le Sprite indiqué à l'intérieur
   * @method hasSpriteInside
   * @param  sprite          le Sprite dont il faut vérifier la présence à l'intérieur de la cellule
   * @return                 true si le Sprite est à l'intérieur, false autrement
   */
  public hasSpriteInside(sprite: Sprite) {
    return (sprite.getX() >= super.getX() && sprite.getY() >= super.getY() && sprite.getEndX() <= this.getEndX() && sprite.getEndY() <= this.getEndY());
  }

  /**
   * Controle si la cellule qui appele est à côté de la cellule en paramètre, en précisant de quel côté
   * La cellule peut être à: any (tous), right, left, top, bottom
   * @method isNextTo
   * @param  cell      la cellule à côté de laquelle vérifier
   * @param  direction la direction à laquelle doit se trouver la cellule appelante par rapport à la cellule en paramètre
   * @return           true si la cellule est du bon côté, false autrement
   */
  public isNextTo(cell: Cell, direction: 'any' | 'right' | 'left' | 'top' | 'bottom'): boolean {
    let retour = false;
    switch (direction) {
      case 'right':
        retour = this._checkOnRight(cell);
        break;
      case 'left':
        retour = this._checkOnLeft(cell);
        break;
      case 'top':
        retour = this._checkOnTop(cell);
        break;
      case 'bottom':
        retour = this._checkOnBottom(cell);
        break;
      case 'any':
        retour = this._checkOnRight(cell) || this._checkOnLeft(cell) || this._checkOnTop(cell) || this._checkOnBottom(cell);
        break;
      default:
        retour = false;
        break;
    }
    return retour;
  }

  /**
   * isNextTo pour le côté droit
   * @method _checkOnRight
   * @param  cell          la cellule sur laquelle vérifier la présence de la cellule this sur la droite
   * @return               vrai si la cellule this est sur la droite, false autrement
   */
  private _checkOnRight(cell: Cell): boolean {
    return (super.getY() === cell.getY() && super.getX() === cell.getEndX());
  }

  /**
   * isNextTo pour le côté gauche
   * @method _checkOnLeft
   * @param  cell          la cellule sur laquelle vérifier la présence de la cellule this sur la gauche
   * @return               vrai si la cellule this est sur la gauche, false autrement
   */
  private _checkOnLeft(cell: Cell): boolean {
    return (super.getY() === cell.getY() && super.getEndX() === cell.getX());
  }

  /**
   * isNextTo pour le dessus
   * @method _checkOnTop
   * @param  cell          la cellule sur laquelle vérifier la présence de la cellule this sur le dessus
   * @return               vrai si la cellule this est sur le dessus, false autrement
   */
  private _checkOnTop(cell: Cell): boolean {
    return (super.getX() === cell.getX() && super.getEndY() === cell.getY());
  }

  /**
   * isNextTo pour le dessous
   * @method _checkOnBottom
   * @param  cell          la cellule sur laquelle vérifier la présence de la cellule this sur le dessous
   * @return               vrai si la cellule this est sur le dessous, false autrement
   */
  private _checkOnBottom(cell: Cell): boolean {
    return (super.getX() === cell.getX() && super.getY() === cell.getEndY());
  }

  /**
   * @method setSprite
   * @param sprite          le nouveau Sprite en foreground
   * @param offsetX         l'offset en X pour la position du Sprite
   * @param offsetY         l'offset en Y pour la position du Sprite
   */
  public setSprite(sprite: Sprite, offsetX?: number, offsetY?: number): Cell { 
    this.offsetX = offsetX ? offsetX : super.getWidth() / 2 - sprite.getImage().getWidth() * sprite.getScale() / 2;
    this.offsetY = offsetY ? offsetY : super.getHeight() / 2 - sprite.getImage().getHeight() * sprite.getScale() / 2;
    this.sprite = sprite; 
    this.drawn = true;
    return this;
  }

  /**
   * @method setOffset
   * @param offsetX         l'offset en X pour la position du Sprite
   * @param offsetY         l'offset en Y pour la position du Sprite
   */
  public setOffset(offsetX: number, offsetY: number): Cell {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    return this;
  }

  public getSprite(): Sprite { return this.sprite; }
  public isStart(): boolean { return this.start; }
  public isEnd(): boolean { return this.end; }
  public isWall(): boolean { return this.wall; }
  public isMandatory(): boolean { return this.mandatory; }
  public isDrawn(): boolean { return this.drawn; }

  public setStart(bool: boolean): Cell { this.start = bool; return this; }
  public setEnd(bool: boolean): Cell { this.end = bool; return this; }
  public setWall(bool: boolean): Cell { this.wall = bool; return this; }
  public setMandatory(bool: boolean): Cell { this.mandatory = bool; return this; }
  public setDrawn(bool: boolean): Cell { this.drawn = bool; return this; }
}

export = Cell;
