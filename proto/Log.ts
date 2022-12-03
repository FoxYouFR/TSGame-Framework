console['success'] = function(text) {
  this.log(`%c ${text}`, 'color: limegreen;');
};

/**
 * @author Kolly Florian
 * @version 1.0 - initial
 * @classdesc Classe permettant de créer et afficher des logs
 */
class Log {
    /** le message */
    private message: string;
    /** la date et l'heure */
    private time: Date;
    /** le type d'alerte */
    private type: string;

    /**
     * @method constructor
     * @param type          le type du message
     * @param message       le message
     */
    public constructor(type: 'warn' | 'error' | 'log' | 'success' , message: string) {
        this.message = message;
        this.type = type;
        this.time = new Date();
    }

    /**
     *  Affiche le log dans la console
     *  @method show
     */
    public show() {
        console[this.type](`${this.formatDate(this.time)} ${this.message}`);
    }

    /**
     * Formate la date
     * @method formatDate
     * @param  date       la date à formater
     * @return            la date formatée
     */
    private formatDate(date: Date): string {
        const pad = function (num) { return ('00' + num).slice(-2) };
        return `[${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} - ${pad(date.getUTCHours() + 2)}:${pad(date.getUTCMinutes())}:${pad(date.getSeconds())}.${date.getMilliseconds()}]`;
    }
}

export = Log;
