import Sprite = require('./Sprite');
import Util = require('./../Util');
import Canvas = require('./../Canvas');

/** @constant instance d'Util */
const util = Util.getInstance();
/** @constant instance du canvas */
const canvas = Canvas.getInstance();
/** @constant tableaux de tout les objets Movable */
const movables = [];

/**
 * @author Kolly Florian
 * @version 1.1 - Suppression du smoothratio
 * @classdesc Classe gérant les objets pouvants être déplacés par le mouvement de souris lorsque le clic est effectué sur le sprite
 * @extends Sprite
*/
class Movable extends Sprite {
  /** la position de base en X */
  private initialX: number;
  /** la position de base en Y */
  private initialY: number;
  /** l'ordre sur la page */
  private z_index: number;
  /** si l'objet est déplaçable */
  private active: boolean;
  /** si l'objet est sélectionné */
  private selected: boolean;

  /**
   * @method constructor
   * @param  image         l'image
   * @param  x           la position X du pixel supérieur gauche
   * @param  y           la position Y du pixel supérieur gauche
   * @param  speed       la vitesse
   * @param  scale       le scale
   * @param  active      si l'objet est déplaçable
   */
  public constructor(image: string, x: number, y: number, speed: number, scale: number, active: boolean = true) {
    super(image, x, y, speed, scale);
    this.initialX = x;
    this.initialY = y;
    this.z_index = movables.length;
    this.active = active;
    this.selected = false;
    movables.push(this);
  }

  /**
   * Permet de savoir si le movable est au-dessus des autres à une certaine position
   * @method isOnTopOf
   * @param  x         la position X à vérifier
   * @param  y         la position Y à vérifier
   * @return           s'il est au-dessus ou non
   */
  public isOnTopOf(x: number, y: number): boolean {
    return this === Movable.getSelectedObj(x, y);
  }

  /**
   * Remet tous les objets Movable dans leur position de départ
   * @method resetPositions
   */
  public static resetPositions(): void {
    for(let obj of movables) {
      obj.update(obj.getInitialX(), obj.getInitialY(), 0);
    }
  }

  /**
   * Fonction s'activant quand la souris est relâchée ou sortie du canvas, ou quand le doigt est relâché.
   * Ne fonctionne pas avec le doigt sortant du canvas
   * @method _onMouseReleased
   * @param  e         l'event
   */
  public static _onMouseReleased(e): void {
    movables.forEach(obj => obj.setSelected(false));
  }

  /**
   * Fonction s'activant par le listener du mouvement de souris
   * Si le clic est activé et la souris est sur un objet Movable,
   * l'objet se déplace. Si un objet est sélectionné, le prend pour le déplacer,
   * autrement recherche l'objet étant sous l'event et ayant le plus haut z_index
   * @method _onListenerActivated
   * @param  e        l'event
   */
  public static _onListenerActivated(e): any {
    e = util.globalizeEvent(e);
    // le touchmove ne cesse pas lorsque le doigt quitte le canvas, DONC il faut check manuellement (merci Apple d'être inutile)
    if(e.type !== 'touchmove' || (e.clientX >= canvas.OFFSETLEFT && e.clientX <= canvas.OFFSETLEFT + canvas.WIDTH && e.clientY >= canvas.OFFSETTOP && e.clientY <= canvas.OFFSETTOP + canvas.HEIGHT)) {
      if(e.isPushed) {
        let selectedObj: Movable;
        for(let obj of movables) {
          if(obj.isSelected()) {
            selectedObj = obj;
            break;
          }
        }
        if(!selectedObj) selectedObj = Movable.getSelectedObj(e.clientX, e.clientY);
        if(selectedObj) {
          selectedObj.setSelected(true);
          movables.forEach(obj => obj.getZ_index() > selectedObj.getZ_index() ? obj.setZ_index(obj.getZ_index() - 1) : undefined);
          selectedObj.setZ_index(movables.length - 1);
          let newX = e.clientX - canvas.OFFSETLEFT - selectedObj.getWidth() / 2;
          let newY = e.clientY - canvas.OFFSETTOP - selectedObj.getHeight() / 2;
          if(newX < 0) {
            newX = 1;
          }
          if(newX + selectedObj.getWidth() > canvas.WIDTH) {
            newX = canvas.WIDTH - selectedObj.getWidth();
          }
          if(newY < 0) {
            newY = 1;
          }
          if(newY + selectedObj.getHeight() > canvas.HEIGHT) {
            newY = canvas.HEIGHT - selectedObj.getHeight();
          }
          selectedObj.update(newX, newY, 0);
        }
      }
    }
  }

  /**
   * Retourne l'objet sous l'event qui possède le plus haut z_index
   * @method getSelectedObj
   * @param  x              la position X
   * @param  y              la position Y
   * @return                l'objet se trouvant dessous les positions indiquées, undefined s'il n'y en a pas
   */
  private static getSelectedObj(x: number, y: number): Movable {
    let selectedObj: Movable;
    for(let obj of movables) {
      if(obj.isActive() && x >= obj.getX() + canvas.OFFSETLEFT && y >= obj.getY() + canvas.OFFSETTOP &&
        x < obj.getX() + canvas.OFFSETLEFT + obj.getWidth()
        && y < obj.getY() + canvas.OFFSETTOP + obj.getHeight()) {
        if(!selectedObj) {
          selectedObj = obj;
        } else if(selectedObj.getZ_index() < obj.getZ_index()) {
          selectedObj = obj;
        }
      }
    }
    return selectedObj;
  }

  public getInitialX(): number { return this.initialX; }
  public getInitialY(): number { return this.initialY; }
  public getZ_index(): number { return this.z_index; }
  public isActive(): boolean { return this.active; }
  public isSelected(): boolean { return this.selected; }

  public setInitialX(initialX: number): Movable { this.initialX = initialX; return this; }
  public setInitialY(initialY: number): Movable { this.initialY = initialY; return this; }
  public setZ_index(z_index: number): Movable { this.z_index = z_index; return this; }
  public setActive(active: boolean): Movable { this.active = active; return this; }
  public setSelected(selected: boolean): Movable { this.selected = selected; return this; }
}

export = Movable;
