import Canvas = require('./Canvas');
import Util = require('./Util');
import Sprite = require('./proto/Sprite');
import Movable = require('./proto/Movable');
import Cell = require('./proto/Cell');
import Engine = require('./Engine');

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant l'ajout de ListenerManager
*/
class ListenerManager {

  /** l'instance de Canvas */
  private canvas: Canvas;
  /** le canvas jQuery */
  private jqueryCanvas = $('#canvas');
  /** l'event utilisé pour le double-clic */
  private CLICK_EVENT: string = 'click';
  /** l'instance de la classe */
  private static instance: ListenerManager;
  /** l'instance de l'affichage */
  private engine: Engine;
  /** une instance d'Util */
  private util: Util;
  /** le timer pour le double-clic */
  private timer: number;
  /** le temps à laisser entre les deux clics du double-clic */
  private wait_ms: number;

  /**
   * @method constructor
   */
  private constructor() {
    this.canvas = Canvas.getInstance();
    this.engine = Engine.getInstance();
    this.util = Util.getInstance();
    this.wait_ms = 200;
    $('#message').hide();
    window.addEventListener('orientationchange', doOnOrientationChange, false);
    this.jqueryCanvas.bind(this.CLICK_EVENT, this.first_click_handler.bind(this));
    this.addListenerOn(document.getElementById('canvas'), ['touchmove'], this.util.preventDefault);
  }

  /**
   * Crée une instance de la classe s'il n'y en a pas et la retourne
   * @method getInstance
   * @return l'instance de la classe
   */
  public static getInstance(): ListenerManager {
    if(!this.instance) {
      this.instance = new ListenerManager();
    }
    return this.instance;
  }

  /**
   * Ajoute les listeners sur l'élément indiqué avec le callback.
   * Les options sont les options standards de la méthode addEventListener
   * @method addListenerOn
   * @param  el            l'élément sur lequel ajouter les listeners
   * @param  events        le tableau des listeners à ajouter
   * @param  callback      le callback à effectuer
   * @param  options       (opt) les options supplémentaires
   */
  public addListenerOn(el: HTMLElement, events: Array<string>, callback: any, options?: any): void {
    for(let e of events) {
      el.addEventListener(e, callback, options || false);
    }
  }

  /**
   * Enlève les listeners sur l'élément indiqué
   * @method removeListenerOn
   * @param  el               l'élément sur lequel enlever les listeners
   * @param  events           le tableau des listeners à enlever
   * @param  callback         le callback à enlever
   */
  public removeListenerOn(el: HTMLElement, events: Array<string>, callback:any): void {
    for(let e of events) {
      el.removeEventListener(e, callback);
    }
  }

  /**
   * Ajoute un listener sur le canvas en cas d'objet Movable
   * Si ce listener n'est pas activé, les objets Movable ne déplaceront pas
   * @method addMovableOnCanvasListener
   */
  public addMovableOnCanvasListener(): void {
    this.canvas.canvas.addEventListener('mousemove', Movable._onListenerActivated, { passive: false });
    this.canvas.canvas.addEventListener('touchmove', Movable._onListenerActivated, { passive: false });
    this.canvas.canvas.addEventListener('mouseup', Movable._onMouseReleased, { passive: false });
    this.canvas.canvas.addEventListener('touchend', Movable._onMouseReleased, { passive: false });
    this.canvas.canvas.addEventListener('mouseout', Movable._onMouseReleased, { passive: false });
    // NOTE: touchleave ne fonctionne pas correctement, il faut donc passer par la détection du doigt sur le canvas fait dans la classe Movable
  }

  /**
   * Listener qui va gérer le premier clic sur l'écran (pour le double-clic --> action)
   * @method first_click_handler
   * @param  evt1                l'event produit par le clic
   */
  private first_click_handler(evt1: any): void {
    evt1 = this.util.globalizeEvent(evt1);
    const selectedObject = this.getSelectedObj(evt1);
    if(this.timer) clearTimeout(this.timer);
    if(selectedObject) {
      this.jqueryCanvas.unbind(this.CLICK_EVENT);
      this.jqueryCanvas.bind(this.CLICK_EVENT, evt2 => this.second_click_handler(evt2, this, selectedObject));
      this.timer = setTimeout((() => {
        this.jqueryCanvas.unbind(this.CLICK_EVENT);
        this.jqueryCanvas.bind(this.CLICK_EVENT, this.first_click_handler.bind(this));
      }), this.wait_ms);
    }
  }

  /**
   * Listener qui va gérer le second clic et lancer la méthode du sprite sur lequel il y a eu double-clic
   * @method second_click_handler
   * @param  evt2                 l'event produit par le clic
   * @param  that                 la référence à this donné par le premier handler (sur lequel this est bind)
   * @param  oldSelectedObject       l'ancien objet qui a été appuyé
   */
  private second_click_handler(evt2: any, that: any, oldSelectedObject: Sprite): void {
    this.jqueryCanvas.unbind(this.CLICK_EVENT);
    evt2 = this.util.globalizeEvent(evt2);
    if(oldSelectedObject && oldSelectedObject.getOnDoubleClick() && oldSelectedObject === that.getSelectedObj(evt2)) {
      (oldSelectedObject.getOnDoubleClick())(); // IIFE sur une propriété type fonction
    }
    this.jqueryCanvas.bind(this.CLICK_EVENT, this.first_click_handler.bind(that));
  }

  /**
   * Retourne l'objet sur lequel il y a eux un clic (les Movables sont toujours prioritaires puisqu'ils sont affichés au-dessus)
   * @method getSelectedObj
   * @param  e              l'event
   * @return                l'objet qui a subit le clic
   */

  /**
   * Retourne l'objet sur lequel il y a eux un clic (les Movables sont toujours prioritaires puisqu'ils sont affichés au-dessus)
   * @method getSelectedObj
   * @param  clientX        la position X du clic
   * @param  clientY        la position Y du clic
   * @return                l'objet sur lequel il y a eu un clic
   */
  private getSelectedObj({ clientX, clientY }): Sprite {
    const allObjects = this.engine.getObjects();
    const movables = allObjects.filter(obj => obj instanceof Movable);
    const cells = allObjects.filter(obj => obj instanceof Cell);
    const others = allObjects.filter(obj => movables.indexOf(obj) === -1); // les cellules sont traitées une fois pour le sprite en background et une fois pour le sprite en foreground
    for(let obj of movables) {
      const movable = <Movable>obj;
      if(movable && movable.getOnDoubleClick() && movable.isOnTopOf(clientX, clientY) && movable.isIn(clientX, clientY)){
        return movable;
      }
    }
    for(let obj of cells) {
      const cell = <Cell>obj;
      if(cell.getSprite() && cell.getSprite().getOnDoubleClick() && cell.getSprite().isIn(clientX, clientY)) {
        return cell.getSprite();
      }
    }
    for(let sprite of others) {
      if(sprite && sprite.getOnDoubleClick() && sprite.isIn(clientX, clientY)) {
        return sprite;
      }
    }
  }
}

/**
 * Affiche le message de rotation d'écran si l'écran n'a pas la bonne orientation
 * @method doOnOrientationChange
 */
function doOnOrientationChange(): any {
  if (window.orientation != -90 && window.orientation != 90) {
    $('#message').show();
    $('#screen').hide();
  } else {
    $('#screen').show();
    $('#message').hide();
  }
}

export = ListenerManager;
