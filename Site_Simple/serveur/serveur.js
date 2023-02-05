/* Équipe: Maher Khaznaji et Linus Levi */

const http = require("http");
const fs   = require('fs');
const path = require('path');
const port = 4200;

const sous_dossier = "/public";
const chemin_page = __dirname + sous_dossier;
const pages = [ "Accueil", "Fabrication", "Utilisation", "Elimination", "Solution" ];	

// Fonction anonyme qui s'occupe du traitement des requêtes
const server = http.createServer((request, response) =>
{
    let contenu_page = "";
	let content_type = 'text/html';

    /*
		Concernant le regex ci-dessous, la première et dernière barre oblique
		délimitent le regEx. La deuxième barre oblique couchée est nécessaire
		pour que la troisième ne soit pas interprétée comme la fin du regEx;
		elle indique qu'elle fait partie de l'expression.
    */
    
    // On emploi un RegEx pour identifier les requêtes pour les images (plus bas)
    //let repImages = /\/public\/images/; // Cette expression est équivalente à la suivante
    let repImages = new RegExp('/images', 'i');
    
	const headers = {
        'Access-Control-Allow-Origin' : '*', /* @dev First, read about security */
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age'      : 86400, // 1 day's worth of seconds
        'Content-Type'                : content_type
    };

	console.log("request.url: ", request.url );

    response.writeHead(200, headers);

	// Fonction qui s'occupe du callback lors d'une erreur.
	function readFile_callback(error, data)
	{
		if (error)
			throw "Erreur de lecture de fichier. " + error;
		else
		{
			//response.writeHead( 200, { 'Content-Type': content_type } );
			response.write(data); // format: response.write(chunk[, encoding][, callback]);
			response.end();
		}
	};
   
    // pour le prochain 'if' on a besoin du premier charactère après la barre oblique (/)
    let numero_page = Number( request.url[1] );

	// car les URL provenant des liens de navigation comportent l'index de la page correspondante
	if ( (request.url.length == 2) && (numero_page < (pages.length + 1)) )
	{
		fs.readFile( path.join(chemin_page + "/" + pages[ numero_page ] + ".html"), "utf8",
					(error, data) => readFile_callback(error, data));
    }
	else if (request.url === "/styles.css")
    {
        fs.readFile( path.join( chemin_page + '/styles.css'), "utf8", (error, data) => {
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(data);
            response.end();
        });
    }
    /*
		Les images nous parviennent en commençant toujours par '/images', d'où le RegEx
		'repImages' plus haut. Cela est ainsi car du côté client, toutes les noms des 
		images sont précédés par '/images'. Cela simplifie davantage la détermination
		des requêtes pour celles-ci.
		
		À noter que certaines images comme .csv ne s'affichent pas. De plus, certaines
		images .jpg ne s'affichent pas non plus, question de spécificité interne.
    */
    else if (repImages.test(request.url))
    {
        let fichier = fs.readFileSync( chemin_page + request.url );
        response.writeHead(200, {'Content-Type' : 'image/jpg'});
        response.end(fichier, 'binary');
    }
    else
    {
        response.write("<p>Erreur: La page n'existe pas</p>");
        response.end();
    }
    console.log("answered request");
});

server.listen(port, () => { console.log("Server is Running"); });