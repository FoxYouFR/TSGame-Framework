import Canvas = require('./Canvas');
import * as PIXI from 'pixi.js';

/** @constant instance du canvas */
const canvas = Canvas.getInstance();

// Instance de l'application Pixi
/** @constant instance de l'application Pixi */
const app = new PIXI.Application({
  forceCanvas: true,
  view: canvas.canvas
});

/** @constant instance du canvasRenderer de Pixi */
const canvasRenderer = PIXI.autoDetectRenderer({
  width: canvas.WIDTH,
  height: canvas.HEIGHT,
  view: canvas.canvas,
  forceCanvas: true,
  transparent: true
});

// Modification du renderer par défaut de l'application
app.renderer = canvasRenderer;

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @class   Classe gérant le framework Pixi
*/
class PixiFramework {

  /**
   * @method constructor
   */
  public constructor() {}

  /**
   * Retourne l'app Pixi
   * @method getApp
   * @return l'app Pixi
   */
  public getApp(): PIXI.Application {
    return app;
  }
}

export = PixiFramework;
