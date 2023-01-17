/* 
    Définition d'une classe Javascript (ES6^)
*/
    class CrudFetchClass {
        // Injection de valeurs de la classe
        constructor(){
            this.url = null;
            this.requestOptions = null;
        }

        init( url, method = 'GET', body = null ){
            // Définir l'URL
            this.url = url;
            
            // Configurer le header de la requête
            this.requestOptions = {
                method: method
            }

            // Configurer les requêtes envoyant des données
            if( ['POST', 'PUT'].indexOf( method ) !== -1 && body !== null ){
                // Définir le type de valeur
                this.requestOptions.headers = {
                    'Content-Type' : 'application/json'
                };

                // Ajouter les valeurs dans le corps de la requête
                this.requestOptions.body = JSON.stringify( body );
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
