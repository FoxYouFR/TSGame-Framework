import IMG = require('./proto/IMG');
import Util = require('./Util');
import Statistics = require('./Statistics');
import Log = require('./proto/Log');

/** @constant instance d'Util */
const util = Util.getInstance();

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe gérant les images et les traductions venant de la base de données
 */
class Resources {
  /** le dictionnaire des images */
  private static IMAGES = {
    'default_sprite_error_framework': new IMG('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABKSURBVDhP3Y+xEcBADIM8XcbOap+GU4HeC4SjE41m4zzvVeZGXWRu1EXmRl1kbtRF5kZdZG7UReZGXfz3uQ11kblRF5kbdZFZzHyGpgGQGV5drAAAAABJRU5ErkJggg==', 16, 16, 1)
  };
  /** le texte par défaut */
  private static DEFAULT_TEXT = '404 - Text Not Found';
  /** le dictionnaire des textes */
  private static TEXTS = {};
  /** le tableau des inputs */
  private static INPUTS = [];
  /** la langue actuelle */
  private static language: string;
  /** le degré actuel */
  private static degre: string;
  /** le texte du tutoriel actuel */
  private static currentTutorialText: string;

  /**
   * Ajoute une image à l'application pour sa future utilisation
   * Automatiquement appelé
   * @method addImage
   * @param  name     le nom de l'image
   * @param  base64   le string base64 représentant l'image
   * @param  width    la largeur de l'image
   * @param  height   la hauteur de l'image
   * @param  frames   le nombre de frames de l'image
   */
  public static addImage(name: string, base64: string, width: number, height: number, frames: number): void {
    Resources.IMAGES[name] = new IMG(base64, width, height, frames);
  }

  /**
   * Ajoute un texte à l'application pour sa future utilisation
   * Automatiquement appelé
   * @method addText
   * @param  name    la langue du texte
   * @param  text    le json du texte
   */
  public static addText(name: string, text: any): void {
    Resources.TEXTS[name] = text;
  }

  /**
   * Ajoute un input qui devra être traduit
   * Automatiquement appelé
   * @method addInput
   * @param  id       l'ID de l'input
   */
  public static addInput(id: string): void {
    Resources.INPUTS.push(id);
  }

  /**
   * Retourne l'image demandée via son nom
   * @method getImage
   * @param  name     le nom de l'image demandée
   * @return          l'objet IMG souhaité
   */
  public static getImage(name: string): IMG {
    if(Resources.IMAGES[name]) {
      return Resources.IMAGES[name];
    } else {
      new Log('error', `Image introuvable -> ${name}`).show();
      return Resources.IMAGES['default_sprite_error_framework'];
    }
  }

  /**
   * Retourne un texte utilisé pour tous sauf le tutoriel
   * @method getOtherText
   * @param  name         le nom du texte
   * @param  options      les données à indiquer si le texte est un template string
   * @return              le texte, modifié avec les valeurs si c'est un template string ou le texte par défaut si la clé n'existe pas
   */
  public static getOtherText(name: string, options?: any): string {
    let text = Resources.DEFAULT_TEXT;
    if(Resources.language) {
      if(Resources.TEXTS[Resources.language][name]) {
        text = Resources.TEXTS[Resources.language][name];
        if(options) {
          let templateString = generateTemplateString(text);
          text = templateString(options);
        }
      } else {
        new Log('error', `Texte introuvable -> ${name}`).show();
      }
    } else {
      new Log('error', `Langue non définie (Resources.changeLanguage pour la définir)`).show();
    }
    return text;
  }

  /**
   * Retourne un texte utilisé uniquement pour le tutoriel
   * @method getOtherText
   * @param  name         le nom du texte
   * @param  options      les données à indiquer si le texte est un template string
   * @return              le texte, modifié avec les valeurs si c'est un template string ou le texte par défaut si la clé n'existe pas
   */
  public static getTutorialText(name: string, options?: any): any {
    let text = Resources.DEFAULT_TEXT;
    if(Resources.language) {
      if(Resources.TEXTS[Resources.language]['tutorial'][name]) {
        Resources.currentTutorialText = name;
        text = Resources.TEXTS[Resources.language]['tutorial'][name];
        if(options) {
          let templateString = generateTemplateString(text);
          text = templateString(options);
        }
      } else {
        new Log('error', `Texte introuvable -> ${name}`).show();
      }
    } else {
      new Log('error', `Langue non définie (Resources.changeLanguage pour la définir)`).show();
    }
    return text;
  }

  /**
   * Méthode appelée quand l'élève change la langue du jeu
   * @method changeLanguage
   * @param  e              l'event
   * @param  lang           la langue si on souhaite la mettre manuellement
   */
  public static changeLanguage(e, lang?: string): any {
    if(lang && Resources.TEXTS[lang]) {
      Resources.language = lang;
    } else if(Resources.TEXTS[lang]) {
      Resources.language = e.target.id
    } else {
      new Log('error', `Langue introuvable -> ${lang ? lang : e.target.id}`).show();
    }
    $('#languageCode').text(Resources.language);
    if(Resources.currentTutorialText) util.setTutorialText(Resources.getTutorialText(Resources.currentTutorialText));
    Resources.INPUTS.forEach(b => $(`#${b}`).val(Resources.getOtherText(b)));
  }

  /**
   * Méthode appelée quand l'élève change le degré du jeu
   * @method changeDegre
   * @param  e           l'event
   * @param  deg         le degré si on souhaite la mettre manuellement
   */
  public static changeDegre(e, deg?: string): any {
    if(deg) Resources.degre = deg;
    else Resources.degre = e.target.id;
    Statistics.setDegre(Resources.degre);
    util.onGameDataChanged();
  }

  public static getDegre(): string {
    return Resources.degre;
  }

  /**
   * Requête (a)jax pour recevoir un exercice (pas asynchrone)
   * @method getExercice
   * @return le JSON de l'exercice
   */
  public static getExercice() {
    let retour: string;
    $.ajax({
      type: 'POST',
      async: false,
      dataType: 'json',
      url: '/getExercice',
      data: {
        degre: Resources.degre
      },
      success: function(result) {
        retour = result;
      }
    });
    return retour;
  }
}

/**
 * Produces a function which uses template strings to do simple interpolation from objects.
 * https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
 *
 * Usage:
 *    var makeMeKing = generateTemplateString('${name} is now the king of ${country}!');
 *
 *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
 *    // Logs 'Bryan is now the king of Scotland!'
 */
const generateTemplateString = (function(){
    const cache = {};
    function generateTemplate(template){
        let fn = cache[template];
        if (!fn){
            // Replace ${expressions} (etc) with ${map.expressions}.
            const sanitized = template
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
                    return `\$\{map.${match.trim()}\}`;
                    })
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
            fn = Function('map', `return \`${sanitized}\``);
        }
        return fn;
    }
    return generateTemplate;
})();

// change la langue lorsque l'utilisateur clique sur une langue
$('.onclick_language').on('click', Resources.changeLanguage);
// change le degre lorsque l'utilisateur clique sur un degre
$('.onclick_degre').on('click', Resources.changeDegre);

export = Resources;
