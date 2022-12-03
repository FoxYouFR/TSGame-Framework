import Canvas = require('./Canvas');
import Movable = require('./proto/Movable');
import Sprite = require('./proto/Sprite');

 /**
  * @author Kolly Florian
  * @version 1.0 - initial
  * @classdesc Classe gérant l'affichage des sprites
 */
class Affichage {
  /** l'instance de Canvas */
  private canvas: Canvas;
  /** l'instance de la classe */
  private static instance: Affichage;

  /**
   * @method constructor
   */
  private constructor() {
    this.canvas = Canvas.getInstance();
  }

  /**
   * Crée une instance de la classe s'il n'y en a pas et la retourne
   * @return l'instance de la classe
   */
  public static getInstance(): Affichage {
    if(!this.instance) {
      this.instance = new Affichage();
    }
    return this.instance;
  }

  /**
   * Active le smoothing sur le canvas
   * @method setSmoothing
   * @param  bool         si le smoothing doit être activé
   */
  public setSmoothing(bool: boolean): void {
    this.canvas.CTX.imageSmoothingEnabled = bool;
  }

  /**
   * Nettoie le canvas
   * @method clear
   */
  public clear(): void {
    this.canvas.CTX.clearRect(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
  }

  /**
   * Dessine les Sprites sur le canvas
   * @method draw
   * @param  objects le tableau des Sprites
   */
  public draw(objects: Array<Sprite>): void {
    this.clear();
    const movables = [];
    const non_movables = [];
    objects.forEach(obj => {
      if(obj instanceof Movable) {
        movables.push(obj);
      } else {
        non_movables.push(obj);
      }
    });
    non_movables.forEach(obj => obj.draw());
    movables.sort((a, b) => a.z_index - b.z_index);
    movables.forEach(obj => obj.draw());
  }
}

export = Affichage;
