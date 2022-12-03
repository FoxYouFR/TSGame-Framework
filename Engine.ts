import Affichage = require('./Affichage');
import Sprite = require('./proto/Sprite');
import Log = require('./proto/Log');

class Engine {

    /** la version du framework */
    private VERSION: string = '2.0';
    /** l'instance d'Affichage */
    private affichage: Affichage;
    /** le tableau de Sprite */
    private objects: Array<Sprite>;
    /** l'instance de la classe */
    private static instance: Engine;

    /**
     * @method constructor
     */
    private constructor() {
        this.objects = [];
        this.affichage = Affichage.getInstance();
        new Log('success', 'L\'Engine a bien été créé').show();
        new Log('success', `Framework chargé en version ${this.VERSION}`).show();
    }

    /**
     * Crée une instance de la classe s'il n'y en a pas et la retourne
     * @method getInstance
     * @return l'instance de la classe
     */
    public static getInstance(): Engine {
        if (!this.instance) {
            this.instance = new Engine();
        }
        return this.instance;
    }

    /**
     * Active le smoothing sur le canvas
     * @method setSmoothing
     * @param  bool         si le smoothing doit être activé
    */
    public setSmoothing(bool: boolean): void {
        this.affichage.setSmoothing(bool);
    }

    /**
     * Démarre le dessin sur le canvas
     * @method startAnimationFrameLoop
     * @return le numéro de l'animation
    */
    public startAnimationFrameLoop(): number {
        this.affichage.setSmoothing(false);
        this.affichage.draw(this.objects);
        new Log('success', 'Démarrage de la boucle de dessin').show();
        return window.requestAnimationFrame(this._drawLoop.bind(this));
    }

    /**
     * Arrête le dessin sur le canvas
     * @method stopAnimationFrameLoop
     * @param  handle   le numéro de l'animation
    */
    public stopAnimationFrameLoop(handle: number): void {
        window.cancelAnimationFrame(handle);
    }

    /**
     * Ajoute les objets dans la liste des objets à dessiner
     * @method addObject
     * @param  obj       les objets à ajouter
    */
    public addObjects(...obj: Array<Sprite>): void {
        obj.forEach(o => this.objects.push(o));
    }

    /**
     * Enlève les objets de la liste des objets à dessiner
     * @method removeObject
     * @param  obj      les objets à enlever
    */
    public removeObjects(...obj: Array<Sprite>): void {
        obj.forEach(o => this.objects.splice(this.objects.indexOf(o), 1));
    }

    /**
     * Enlève tous les objets de la liste des objets à dessiner
     * @method removeAllObjects
    */
    public removeAllObjects(): void {
        this.objects = [];
    }

    /**
     * Nettoye l'affichage
     */
    public clear(): void {
        this.affichage.clear();
    }

    /**
     * Demande de mettre à jour et dessine les objets
     * @method _drawLoop
     * @param  timestamp le temps renvoyé par la requestAnimationFrame
     */
    private _drawLoop(timestamp: number): void {
        this._updateSprites(timestamp);
        this.affichage.draw(this.objects);
        window.requestAnimationFrame(this._drawLoop.bind(this));
    }

    /**
     * Mets à jour tous les sprites
     * @method _updateSprites
     * @param  timestamp le temps renvoyé par la requestAnimationFrame
     */
    private _updateSprites(timestamp: number): void {
        this.objects.forEach(obj => obj.update(0, 0, timestamp));
    }

    public getObjects(): Array<Sprite> { return this.objects; }
}

export = Engine;
