// Instancier la class Fetch
const Fetcher = new CrudFetchClass();

/* 
    Attendre le chargement du DOM pour lancer le programme Javascript
    L'objectif est de s'assurer que les balises HTML sont bien affichées dans la vue
*/
    document.addEventListener('DOMContentLoaded', async () => {
        // Déclaration
        let activeVue = '#home';
        let fetchIsActive = false;
        const navLinks = document.querySelectorAll('nav a');

        // Fonctions
        const navigationInterface = links => {
            // Boucle sur les liens de navigation
            for( let item of links ){
                // Capte l'événement 'click'
                item.addEventListener('click', event => {
                    // Stopper l'événement
                    event.preventDefault();

                    // Récupérer la valeur de l'attribut HREF pour définir la vue
                    activeVue = event.target.getAttribute('href');

                    // Vider le contenu de la balise MAIN
                    document.querySelector('main').innerHTML = '';

                    // Afficher le contenu des vues
                    switch( activeVue ){
                        case '#create': displayCreatePost(); break
                        default: displayPostList(); break;
                    };
                })
            }
        };

        const displayPostList = async () => {
            try {
                // Configurer la requête
                Fetcher.init(
                    'http://localhost:3001/posts',
                    'GET'
                )
    
                // Lancer la requête
                const postList = await Fetcher.sendRequest();

                // Créer une balise UL
                let listTag = document.createElement('ul');

                // Extraire les articles de la liste
                for( let item of postList ){
                    // Créer une balise LI et A
                    let listItemTag = document.createElement('li');
                    
                    // Ajouter une balise A dans la balise LI
                    let anchorTag = document.createElement('a');
                    anchorTag.innerText = item.title;
                    anchorTag.setAttribute('href', item.id);
                    listItemTag.appendChild( anchorTag );

                    // Capter le click sur le lien
                    anchorTag.addEventListener('click', event => {
                        // Stopper l'événement
                        event.preventDefault();

                        displaySinglePost( anchorTag.getAttribute('href') )
                    })
                    
                    // Ajouter une balise button dans la balise LI
                    let deleteButton = document.createElement('button');
                    deleteButton.innerText = 'Supprimer';
                    deleteButton.setAttribute('data-post-id', item.id);
                    deleteButton.setAttribute('class', 'button is-small ml-2');
                    listItemTag.appendChild( deleteButton );

                    let updateButton = document.createElement('button');
                    updateButton.innerText = 'Modifier';
                    updateButton.setAttribute('class', 'button is-small ml-2');
                    listItemTag.appendChild( updateButton );

                    // Capter le click sur les boutons
                    deleteButton.addEventListener('click', () => {
                        deleteOnePost( deleteButton.getAttribute('data-post-id') )
                    })
                    updateButton.addEventListener('click', () => {
                        document.querySelector('main').innerHTML = ''
                        displayCreatePost( item )
                    })

                    // Ajouter la balise LI dans la balise UL
                    listTag.appendChild( listItemTag );
                }

                // Afficher la liste des articles dans la balise MAIN
                document.querySelector('main').appendChild(listTag);
            } 
            catch (error) {
                console.log('[DEBUG] displayPostList error', error);
            }
        }

        const deleteOnePost = id => {
            // Configurer la requête
            Fetcher.init(
                `http://localhost:3001/posts/${ id }`,
                'DELETE'
            )
            
            Fetcher.sendRequest()
            .then( fetchSuccess => {
                // Vider la balise main
                document.querySelector('main').innerHTML = ``;

                // Renvoyer l'utilisateur vers la page d'accueil
                displayPostList();
            })
            .catch( fetchError => {
                console.log(fetchError)
            })
        }

        const displayCreatePost = ( data = null ) => {
            // Créer un formulaire HTML
            let formTag = document.createElement('form');

            // Créer un input de type text
            let inputTitle = document.createElement('input');
            inputTitle.setAttribute('name', 'title');
            inputTitle.setAttribute('type', 'text');
            inputTitle.setAttribute('minlength', 2);
            inputTitle.setAttribute('required', true);
            inputTitle.setAttribute('class', 'input');

            // Créer un champs de saisie
            let textareaContent = document.createElement('textarea');
            textareaContent.setAttribute('name', 'content');
            textareaContent.setAttribute('minlength', 5);
            textareaContent.setAttribute('required', true);
            textareaContent.setAttribute('class', 'textarea');

            // Créer un bouton de soumission de formulaire
            let submitButton = document.createElement('button');
            submitButton.innerText = 'Submit'
            submitButton.setAttribute('type', 'submit');
            submitButton.setAttribute('class', 'button');

            // Injecter les valeurs en paramêtre
            if(data){
                inputTitle.value = data.title;
                textareaContent.value = data.content;
            }

            // Ajouter le contenu dans le formulaire
            formTag.appendChild(inputTitle)
            formTag.appendChild(textareaContent)
            formTag.appendChild(submitButton)

            // Ajouter le formulaire dans le DOM
            document.querySelector('main').appendChild(formTag);

            // Capter la soumission du formulaire pour créer un nouvel article
            submitNewPost( formTag, data )
        }

        const submitNewPost = (form, data = null) => {
            // Capter la soumission du formulaire
            form.addEventListener('submit', event => {
                // Stopper l'événement
                event.preventDefault();

                // Définir une variable pour la validation du formulaire
                let formIsValide = true;

                // Préparer l'objet à envoyer dans l'API
                let newPostObject = {};

                // Vérifier les champs du formulaire
                for( let input of event.srcElement ){
                    if( input.hasAttribute('name') && input.hasAttribute('required') ){
                        // Vérifier les valeurs du formulaire
                        if( +input.getAttribute('minlength') <= input.value.length ){
                            // Ajouter les valeurs dans l'objet à envoyer dans l'API
                            newPostObject[input.getAttribute('name')] = input.value;
                        }
                        else{
                            // Bloquer la soumission du formulaire
                            formIsValide = false;
                        }
                    }
                }

                // Vérifier la validité du formulaire
                if( formIsValide && Object.keys(newPostObject).length && !fetchIsActive ){
                    fetchIsActive = true;

                    // Configurer la requête
                    Fetcher.init(
                        data
                            ? `http://localhost:3001/posts/${ data.id }`
                            : `http://localhost:3001/posts/`,
                        data ? 'PUT' : 'POST',
                        newPostObject
                    )

                    // Envoyer l'objet vers l'API
                    Fetcher.sendRequest()
                    .then( fetchSuccess => {
                        // Vider la balise main
                        document.querySelector('main').innerHTML = ``;

                        // Renvoyer l'utilisateur vers la page d'accueil
                        displayPostList();

                        // Ré-activer la soumission du formulaire
                        fetchIsActive = false;
                    })
                    .catch( fetchError => {
                        console.log(fetchError)
                    })
                }
            })
        }

        /* 
            Créer une fonction pour afficher un article
            - h1 pour le titre
            - p pour le contenu
            - button pour retourner en arrière
        */
        const displaySinglePost = id => {
            // Configurer la requête
            Fetcher.init(
                `http://localhost:3001/posts/${ id }`,
                'GET'
            );
            
            Fetcher.sendRequest()
            .then( fetchSuccess => {
                // Créer une balise H1
                let myTitle = document.createElement('h1');
                myTitle.innerText = fetchSuccess.title;

                // Créer une balise P
                let myContent = document.createElement('p');
                myContent.innerText = fetchSuccess.content;

                // Créer une balise BUTTON
                let myButton = document.createElement('button');
                myButton.innerText = 'retour';

                // Ajouter les balises dans le DOM
                document.querySelector('main').innerHTML = '';
                document.querySelector('main').appendChild(myTitle);
                document.querySelector('main').appendChild(myContent);
                document.querySelector('main').appendChild(myButton);

                // Capter le click sur le bouton
                myButton.addEventListener('click', () => {
                    document.querySelector('main').innerHTML = '';
                    displayPostList();
                })
            })
            .catch( fetchError => {
                console.log(fetchError);
            })
        }

        // Start
        navigationInterface( navLinks );
        displayPostList();
        /* displayCreatePost() */
    })
//