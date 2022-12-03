import { Gamemode } from './Gamemode';
import { SweetAlertType } from 'sweetalert2';
import Swal from 'sweetalert2';
import Statistics = require('./Statistics');

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant des fonctionnalités pratiques
*/
class Util {
  /** l'instance de la classe */
  private static instance: Util;
  /** le div du tutoriel */
  private div: HTMLElement;
  /** le mode de jeu actuel */
  private gamemode: string;
  /** callback lorsque le mode de jeu est changé */
  private gamemodeChangedCallback: any;

  /**
   * @method constructor
   */
  private constructor() {
    this.div = <HTMLElement>document.getElementById('tutorial');
    this.gamemode = Gamemode.Explore;
    $('#onclick_gamemode_explore').on('click', () => {
      if(this.gamemode !== Gamemode.Explore) {
        this.gamemode = Gamemode.Explore;
        this.onGameDataChanged();
      }
    });
    $('#onclick_gamemode_train').on('click', () => {
      if(this.gamemode !== Gamemode.Train) {
        this.gamemode = Gamemode.Train;
        this.onGameDataChanged();
      }
    });
    $('#onclick_gamemode_evaluate').on('click', () => {
      if(this.gamemode !== Gamemode.Evaluate) {
        this.gamemode = Gamemode.Evaluate;
        this.onGameDataChanged();
      }
    });
    $('#onclick_gamemode_create').on('click', () => {
      if(this.gamemode !== Gamemode.Create) {
        this.gamemode = Gamemode.Create;
        this.onGameDataChanged();
      }
    });
  }

  /**
   * Crée une instance de la classe s'il n'y en a pas et la retourne
   * @method getInstance
   * @return l'instance de la classe
   */
  public static getInstance(): Util {
    if(!this.instance) {
      this.instance = new Util();
    }
    return this.instance;
  }

  /**
   * Modifie les paramètres graphiques du tutoriel
   * @method setTutorialParams
   * @param  options  les options à modifier
   */
  public setTutorialParams(options: any): void {
    if(options) {
      if(options.fontSize) this.div.style.fontSize = options.fontSize;
      if(options.fontStyle) this.div.style.fontStyle = options.fontStyle;
      if(options.fontFamily) this.div.style.fontFamily = options.fontFamily;
      if(options.fontWeight) this.div.style.fontWeight = options.fontWeight;
      if(options.color) this.div.style.color = options.color;
      if(options.textDecoration) this.div.style.textDecoration = options.textDecoration;
    }
  }

  /**
   * Modifie le texte du tutoriel
   * @method setTutorialText
   * @param  text     le texte à mettre
   */
  public setTutorialText(text: string): void {
    this.div.innerHTML = text;
  }

  /**
   * Affiche les inputs dont l'ID est indiqué
   * @method showTutorialInputs
   * @param  ...ids             liste des IDs des inputs à afficher
   */
  public showTutorialInputs(...ids: Array<string>) {
    for(let id of ids) {
      $(`#${id}`).show();
    }
  }

  /**
   * Cache les inputs dont l'ID est indiqué
   * @method hideTutorialInputs
   * @param  ...ids             liste des IDs des inputs à cacher
   */
  public hideTutorialInputs(...ids: Array<string>) {
    for(let id of ids) {
      $(`#${id}`).hide();
    }
  }

  /**
   * Affiche une alerte SweetAlert
   * @method showAlert
   * @param  type      le type de l'alerte
   * @param  text      le texte de l'alerte
   * @param  title     (opt) le titre de l'alerte
   * @param  footer    (opt) le footer de l'alerte
   * @param  callback  (opt) un callback à effectuer lors de la fermeture de l'alerte
   */
  public showAlert(type: SweetAlertType, text: string, title?: string, footer?: string, callback?: any): void {
    Swal.fire({
      type: type,
      title: title || '',
      text: text,
      footer: footer || '',
      onClose: () => {
        if(callback) callback();
      }
    });
  }

  /**
   * Affiche une alerte SweetAlert personnalisée
   * @method showAlertPersonnalized
   * @param  options  les options de SweetAlert
   */
  public showAlertPersonnalized(options: any): void {
    Swal.fire(options);
  }

  /**
   * Bloque l'event par défaut sur l'élément indiqué
   * @method preventDefault
   * @param  e        l'event devant être bloqué
   */
  public preventDefault(e: Event): void {
    e.preventDefault();
  }

  /**
   * Globalise un event interplateforme
   * @method globalizeEvent
   * @param  e        l'event à globaliser
   * @returns         l'event modifié
   */
  public globalizeEvent(e: any): Event {
    if(e.touches && e.touches[0]) {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }
    if(!e.clientX || !e.clientY) {
      if(e.originalEvent) {
        e.clientX = e.originalEvent.clientX;
        e.clientY = e.originalEvent.clientY;
      }
    }
    if(e.type === 'touchmove' || e.type === 'touchstart' || e.buttons === 1) {
      e.isPushed = true;
    } else {
      e.isPushed = false;
    }
    return e;
  }

  /**
   * Ajoute la méthode a appeler lorsque le mode de jeu ou le degre est modifié
   * @method callOnGamemodeChange
   * @param  callback             la méthode à appelé
   */
  public callOnGamemodeChange(callback: any): void {
    this.gamemodeChangedCallback = callback;
  }

  public onGameDataChanged(): void {
    if(this.gamemode === Gamemode.Train) {
      Statistics.addStats(1);
    } else if(this.gamemode === Gamemode.Evaluate) {
      Statistics.addStats(2);
    }
    if(this.gamemodeChangedCallback) this.gamemodeChangedCallback();
  }

  public getGamemode(): string { return this.gamemode; }
}

export = Util;
