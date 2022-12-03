import * as PF from 'pathfinding';
import Cell = require('./proto/Cell');

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant la recherche de chemin dans une grille
*/
class Pathfinder {
  /** Finder de PathFinding.js */
  private finder: PF.Finder;
  /** Grid de PathFinding.js */
  private grid: PF.Grid; 

  /**
   * @method constructor
   */
  public constructor() {}

  /**
   * Initialise l'objet de recherche avec l'algorithme spécifié.
   * Ne supporte que A*, BFS et Dijkstra
   * @method initiateGridFinder
   * @param  algorithm l'algorithme à utiliser
   */
  public initiateGridFinder(algorithm: string): void {
    switch(algorithm) {
      case 'astar':
        this.finder = new PF.AStarFinder();
        break;
      case 'bfs':
        this.finder = new PF.BreadthFirstFinder();
        break;
      case 'dijkstra':
        this.finder = new PF.DijkstraFinder();
        break;
      default:
        this.finder = undefined;
        break;
    }
  }

  /**
   * Indique la grille dans laquelle effectuer la recherche
   * @method setGrid
   * @param  cells   le tableau de cellules
   * @param  width   la largeur de la grille
   * @param  height  la hauteur de la grille
   */
  public setGrid(cells: Array<Cell>, width: number, height: number): void {
    this.grid = new PF.Grid(width, height);
    for(let cell of cells) {
      if(cell.isWall()) {
        this.grid.setWalkableAt(cell.getX() / cell.getSideX(), cell.getY() / cell.getSideY(), false);
      }
    }
  }

  /**
   * Lance la recherche pour trouver le chemin optimal
   * @method runFinder
   * @param  start     la cellule de départ
   * @param  end       la cellule d'arrivée
   * @return           Un tableau 2D avec les position X et Y des cellules du parcours optimal.
   *                   Si le tableau est vide, il n'y a pas de chemin
   */
  public runFinder(start: Cell, end: Cell): Array<Array<number>> {
    if(this.finder) {
      const savedGrid = this.grid.clone();
      const path = this.finder.findPath(start.getX() / start.getSideX(), start.getY() / start.getSideX(), end.getX() / end.getSideX(), end.getY() / end.getSideY(), this.grid);
      this.grid = savedGrid;
      return path;
    }
  }
}

export = Pathfinder;
