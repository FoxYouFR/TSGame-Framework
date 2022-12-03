import Cell = require('./proto/Cell');
import Canvas = require('./Canvas');
import Engine = require('./Engine');

/** @constant instance du canvas */
const canvas = Canvas.getInstance();

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant le dessin de structure de base
 */
class Structure {
  /** l'instance de Engine */
  private engine: Engine;

  /**
   * @method constructor
   */
  public constructor() {
    this.engine = Engine.getInstance();
  }

  /**
   * Dessine une grille
   * @method drawGrid
   * @param  xPosition la position X du pixel supérieur gauche
   * @param  yPosition la position Y du pixel supérieur gauche
   * @param  width     la largeur totale de la grille
   * @param  height    la hauteur totale de la grille
   * @param  lines     le nombre de ligne de la grille
   * @param  cols      le nombre de colonne de la grille
   * @param  image     l'image pour le background des Cell
   * @param  scale     le scale pour les Cell
   * @return           le tableau de cellules
   */
  public drawGrid(xPosition: number, yPosition: number, width: number, height: number, lines: number, cols: number, image: string, scale: number): Array<Cell> {
    const sideX = width / cols;
    const sideY = height / lines;
    canvas.CTX.beginPath();
    let cells = [];
    let x = xPosition, y = yPosition;
    for(let i = 0; i < cols; i++) {
      y = yPosition;
      for(let j = 0; j < lines; j++) {
        let curCell = new Cell(image, x, y, scale);
        this.engine.addObjects(curCell);
        cells.push((curCell));
        y += sideY;
      }
      x += sideX;
    }
    canvas.CTX.stroke();
    return cells;
  }
}

export = Structure;
