document.addEventListener('DOMContentLoaded', async () => {
    /* 
        CRUD: Create
        Ajouter un objet dans une collection avec l'API fetch
    */
        const createNewPost = new CrudFetchClass(
            'http://localhost:3001/posts/',
            'POST',
            {
                title: `Super article`,
                content: `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.`
            }
        );
        
        // Initier la reuqête
        createNewPost.init()

        createNewPost.sendRequest()
        .then( fetchSuccess => {
            console.log(fetchSuccess)
        })
        .catch( fetchError => {
            console.log(fetchError)
        })
    //

    /* 
        CRUD : Read
        Utiliser l'API Fetch pour exécuter une requête HTTP
    */
        // Créer une instance de la classe
        const getCrudInformations = new CrudFetchClass(
            'http://localhost:3001/posts/',
            'GET'
        );
    
        // Initialiser la requête
        getCrudInformations.init();
    
        const postList = await getCrudInformations.sendRequest();
        console.log(postList)
    //
})


