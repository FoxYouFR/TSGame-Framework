import Log = require("./proto/Log");

class Statistics {
  /** l'id de la statistique étant en jeu */
  private static idStats: number;
  /** le degre actuel */
  private static degre: string;

  /**
   * Requête ajax pour sauvegarder une nouvelle ligne dans l'historique
   * @method addStats
   * @param  mode     le mode de jeu (1: Entrainer, 2: Evaluer)
   */
  public static addStats(mode: number) {
    $.ajax({
      type: 'POST',
      url: '/addStats',
      dataType: 'json',
      timeout: 2000,
      data: {
        mode: mode,
        harmos: Statistics.degre
      },
      success: function (xhr: any) {
        if (!xhr.data.id) {
          new Log('error', xhr.message).show();
        } else {
          Statistics.idStats = xhr.data.id;
          new Log('success', xhr.message).show();
        }
      },
      error: function (xhr: any) {
        console.log(xhr);
        try {
          new Log('error', JSON.parse(xhr.responseText).message).show();
        } catch (error) {
          new Log('error', 'Timeout -> addStats (classe Statistics)').show();
        }
      }
    });
  }

  /**
   * Requête ajax pour mettre à jour les statistiques
   * @method updateStats
   * @param  evaluation  l'evaluation donnée (0, 1 ou 2)
   */
  public static updateStats(evaluation: number) {
    if (!(evaluation === 0 || evaluation === 1 || evaluation === 2)) {
      new Log('error', `Valeur de l'évaluation incorrecte -> evaluation`).show();
      return;
    }
    $.ajax({
      type: 'POST',
      url: '/updateStats',
      dataType: 'json',
      timeout: 2000,
      data: {
        id: Statistics.idStats,
        evaluation: evaluation
      },
      success: function (xhr: any) {
        Statistics.idStats = xhr.data.id;
        new Log('success', xhr.message).show();
      },
      error: function (xhr: any) {
        console.log(xhr);
        try {
          new Log('error', JSON.parse(xhr.responseText).message).show();
        } catch (error) {
          new Log('error', 'Timeout -> updateStats (classe Statistics)').show();
        }
      }
    });
  }

  public static setDegre(degre: string) { Statistics.degre = degre; };
}

export = Statistics;
