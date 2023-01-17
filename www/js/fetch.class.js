/* 
    Définition d'une classe Javascript (ES6^)
*/
    class CrudFetchClass {
        // Injection de valeurs de la classe
        constructor( url, method = 'GET', body = null ){
            this.url = url;
            this.method = method;
            this.body = body;
            this.requestOptions = null;
        }

        init(){
            // Configurer le header de la requête
            this.requestOptions = {
                method: this.method
            }

            // Configurer les requêtes envoyant des données
            if( ['POST', 'PUT'].indexOf( this.method ) !== -1 ){
                // Définir le type de valeur
                this.requestOptions.headers = {
                    'Content-Type' : 'application/json'
                };

                // Ajouter les valeurs dans le corps de la requête
                this.requestOptions.body = JSON.stringify( this.body );
            }
        }

        sendRequest(){
            // Mise en place d'une Promesse https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise
            return new Promise( ( resolve, reject ) => {
                // Utilisation de l'API fetch => https://developer.mozilla.org/fr/docs/Web/API/Fetch_API
                fetch( this.url, this.requestOptions )
                .then( fetchSuccess => {
                    // Vérifier l'état de la requête
                    if( fetchSuccess.ok ){
                        // Extraire les valeurs au format JSON
                        return fetchSuccess.json();
                    }
                    else{
                        return reject('Fecth success false')
                    }
                })
                .then( jsonCollection => {
                    // Résoudre la Promesse
                    return resolve( jsonCollection );
                })
                .catch( fetchError => {
                    // Rejeter la Promesse
                    return reject( fetchError );
                })
            })
        }
    }
//
