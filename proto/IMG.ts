/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant le chargement des images venant de la base de données
 */
class IMG {
  /** l'image */
  private image: HTMLImageElement;
  /** la largeur de l'image */
  private width: number;
  /** la hauteur de l'image */
  private height: number;
  /** le nombre de frames de l'image */
  private frames: number;
  /** si l'image est chargée */
  private loaded: boolean;

  /**
   * @method constructor
   * @param  base64      le string représentant l'image
   * @param  width       la largeur de l'image
   * @param  height      la hauteur de l'image
   * @param  frames      le nombre de frames de l'image
  */
  public constructor(base64: string, width: number, height: number, frames: number) {
    this.frames = frames;
    this.width = width / this.frames;
    this.height = height;
    this.image = new Image();
    this.image.onload = (function(that) {
      return function() {
        that.loaded = true;
      }
    })(this);
    this.image.src = `data:image/png;base64,${base64}`
  }

  public getWidth(): number { return this.width; }
  public getHeight(): number { return this.height; }
  public getImage(): HTMLImageElement { return this.image; }
  public getFrames(): number { return this.frames; }
  public isLoaded(): boolean { return this.loaded; }

}

export = IMG;
