/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant l'instance du canvas. Crée automatiquement l'élèment canvas
*/
class Canvas {
  /** le canvas HTML */
  public canvas: HTMLCanvasElement;
  /** la largeur du canvas */
  public WIDTH: number;
  /** la hauteur du canvas */
  public HEIGHT: number;
  /** le déplacement du canvas sur la gauche */
  public OFFSETLEFT: number;
  /** le déplacement du canvas sur la droite */
  public OFFSETTOP: number;
  /** le contexte du canvas */
  public CTX: CanvasRenderingContext2D;
  /** l'instance de la classe */
  private static instance: Canvas;

  /**
   * @method constructor
   */
  private constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.CTX = this.canvas.getContext('2d');
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;
    this.OFFSETLEFT = this.canvas.offsetLeft;
    this.OFFSETTOP = this.canvas.offsetTop;
  }

  /**
   * Crée une instance de la classe s'il n'y en a pas et la retourne
   * @return l'instance de la classe
   */
  public static getInstance(): Canvas {
    if(!this.instance) {
      this.instance = new Canvas();
    }
    return this.instance;
  }
}

export = Canvas;
