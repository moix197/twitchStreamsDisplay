const dataHandle ={
	//this object handle the data that comes from the "backend"
	//and initialize our UI once we get the streams and game button data

	apiCallUrl: 'https://api.twitch.tv/kraken/streams?client_id=kcrh2z2tj9qqs1asztf6n755zmwspns', // replace the {CLIENT_ID_HERE} with your twitch API client id
	apiSelectionUrl: 'https://api.twitch.tv/kraken/games/top?client_id=kcrh2z2tj9qqs1asztf6n755zmwspns',  // replace the {CLIENT_ID_HERE} with your twitch API client id

	init(){
		this.getOnlineStreams('All');
		this.getGames();
	},

	handleApiCall(apiURL,callback){
		fetch(apiURL)
			.then(res => res.json())
			.then(response => {
				callback(response);
			})
			.catch((error) => {
				console.log(error);
			});
	},

	getGames(){
		this.handleApiCall(this.apiSelectionUrl, (response) => {
            // This call will initialize the game Selection Buttons (The ones on top)
			this.initGamesSelectionBar(response);
			//We don't handle error cases here because even if we don't get the games lists
			//we can still show the streams for the "all" category which for this test is enough.
			//if you're in a production enviroment you may want to
		});
	},

	getOnlineStreams(){
		// This call will render online streams for the selected game if no game is selected will display the most popular streams
		this.loaderElement.style.display = "block";
		this.handleApiCall(this.apiCallUrl, (response) => {
			if(response && response.streams && response.streams.length > 0){
				//Calling the function to render the streams after getting the api response
				this.initStreams(response);
			}else{
				this.initFallback();
			}
		});
	}
};

export default dataHandle;
//we can initialize it this way because this is 
//bassically the full App 
//twitchData.init();
//if you want to initialize this webapp
//in your page after any other event you can remove the IIFE
//and give the function a name, then you can call it from
//wherever you want in your app and you'll only be placing one name
//in the global context.