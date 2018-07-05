var apiCallUrl = 'https://api.twitch.tv/kraken/streams?client_id={CLIENT_ID_HERE}', // replace the {CLIENT_ID_HERE} with your twitch API client id
	apiSelectionUrl = 'https://api.twitch.tv/kraken/games/top?client_id={CLIENT_ID_HERE}',  // replace the {CLIENT_ID_HERE} with your twitch API client id
	outerElement = document.getElementById('outerStreams'),
	loaderElement = document.getElementById('streamsLoader'),
	btnElements = ['All'], //leave the All element, as it wont come from the API
	activeTab = 'All', 
	data;

renderStreams = function(data){
	/*Here we render the streams and append all the divs to the HTML document.*/
	data.streams.forEach(function(element) {
		
		var streamId = element.channel.display_name.split(' ').join('_');

		SingleStream = document.createElement('div');
		SingleStream.setAttribute("class", "singleStream");
		SingleStream.setAttribute("id", streamId);

		streamDetails = document.createElement('div');
		streamDetails.setAttribute("class", "streamDetails");

		outerImageStream = document.createElement('div');
		outerImageStream.setAttribute("class", "outerImageStream");
		imageStream = document.createElement('img');
		imageStream.src = element.preview.medium;

		gameContainer = document.createElement('div');
		gameContainer.setAttribute("class", "titleName gameName");
		gameLayoutContainer = document.createElement('p');
		gameLayoutContainer.innerHTML = 'Game: ';
		gameNameContainer = document.createElement('p');
		
		playerContainer = document.createElement('div');
		playerContainer.setAttribute("class", "titleName");
		playerLayoutContainer = document.createElement('p');
		playerLayoutContainer.innerHTML = 'User: ';
		playerNameContainer = document.createElement('p');
		
		languageContainer = document.createElement('div');
		languageContainer.setAttribute("class", "titleName");
		languageLayoutContainer = document.createElement('p');
		languageLayoutContainer.innerHTML = 'Language: ';
		languageNameContainer = document.createElement('p');
		
		viewersContainer = document.createElement('div');
		viewersContainer.setAttribute("class", "titleName");
		viewersLayoutContainer = document.createElement('p');
		viewersLayoutContainer.innerHTML = 'Viewers: ';
		viewersNameContainer = document.createElement('p');

		outerElement.append(SingleStream);
			
			SingleStream.append(imageStream);
			SingleStream.append(outerImageStream);
				outerImageStream.append(imageStream);
			SingleStream.append(streamDetails);

				streamDetails.append(gameContainer);
					gameContainer.append(gameLayoutContainer);
					gameContainer.append(gameNameContainer);
						gameNameContainer.append(element.game);

				streamDetails.append(playerContainer);
					playerContainer.append(playerLayoutContainer);
					playerContainer.append(playerNameContainer);
					playerNameContainer.append(element.channel.display_name);

				streamDetails.append(viewersContainer);
					viewersContainer.append(viewersLayoutContainer);
					viewersContainer.append(viewersNameContainer);
						viewersContainer.append(element.viewers);

				streamDetails.append(languageContainer);
					languageContainer.append(languageLayoutContainer);
					languageContainer.append(languageNameContainer);
						languageContainer.append(element.channel.language.toUpperCase());
		
		setStreamClickEvents(streamId);
	});

	loaderElement.style.display = "none";
}

setStreamClickEvents = function(streamId){
	
	document.getElementById(streamId).addEventListener("click", function(e){
		
		streamId = streamId.split('_').join('%20');
		var	channel = 'http://player.twitch.tv/?channel='+streamId;

		document.getElementById('liveVideoIframe').setAttribute('src',channel);
		document.getElementById('outerIframe').classList.add('openedStream');
		document.getElementById('closeStream').style.display = 'block';
		document.getElementById('liveVideoIframe').scrollIntoView({ behavior: 'smooth' });
		
	});

}

renderSelectionBtns = function(data){
	//Here we render the Games buttons so the user can select a game to show streams for

	var outerSelectionElement = document.getElementById('outerGameSelection');

	data.top.forEach(function(element){

		itemId = element.game.name.split(' ').join('_')

		selectionBtn = document.createElement('img');
		selectionBtn.setAttribute("src", element.game.box.medium);
		selectionBtn.setAttribute("class", "selectionBtn");
		selectionBtn.setAttribute("id", itemId);
		
		outerSelectionElement.append(selectionBtn);
		selectionBtn.append(element.game.name);
		btnElements.push(itemId);
		setGamesClickEvents(itemId);

	});

	setGamesClickEvents('All');

}

resetGames = function(){
	//This is only use to reset the streams after the user selects a new one
	outerElement.innerHTML = '';
}

setGamesClickEvents = function(itemId){
	
	document.getElementById(itemId).addEventListener("click", function(e){

		if(activeTab == itemId){
			return;
		}

		gameName = itemId.split('_').join('%20');

		if(gameName == 'All'){

			apiCallUrl = 'https://api.twitch.tv/kraken/streams?client_id=kcrh2z2tj9qqs1asztf6n755zmwspns';

		}else{

			apiCallUrl = 'https://api.twitch.tv/kraken/streams?game='+gameName+'&client_id=kcrh2z2tj9qqs1asztf6n755zmwspns';
			
		}

		document.getElementById(activeTab).classList.remove("selectedGame");
		this.classList.add("selectedGame");

		resetGames();
		apiCallStreams(apiCallUrl, itemId);
		
	});
			
}

apiCallSelection = function(apiUrl){
	// This call will render the game Selection Buttons (The ones on top)

	$.ajax({
	    type: "GET",
	    dataType: "json",
	    url: apiSelectionUrl,
	    success: function(data) {
			
			/*Calling the function to render the games after getting the api response*/
			renderSelectionBtns(data);

			//Here you have the data from the API call, you can do whatever you want with it
			//you just need to use the "data" object.
			//uncomment the next line if you want to see the object in the console.
			//console.log(data);

	    },
	    error: function(e) {

	        console.log("sorry, we couldn't retrieve the data from de API at this time.");

	        //Here you can execute a fallback function or whatever you want in case the data isn't retrieved

	    }
	});

}

document.getElementById('closeStream').addEventListener("click", function(e){
	
	document.getElementById('outerGameSelection').scrollIntoView({ behavior: 'smooth' });
	document.getElementById('liveVideoIframe').setAttribute('src', '');
	document.getElementById('outerIframe').classList.remove('openedStream');
	document.getElementById('closeStream').style.display = 'none';
	
});


apiCallStreams = function(apiUrl,itemId){
	// This call will render online streams for the selected game if no game is selected will display the most popular streams

	loaderElement.style.display = "block";

	$.ajax({
	    type: "GET",
	    dataType: "json",
	    url: apiUrl,
	    success: function(data) {
			

			if(data.streams.length > 0){

				//Calling the function to render the games after getting the api response
				renderStreams(data);
			
			}else{

				//Fallback in case the response is empty
				loaderElement.style.display = "none";
				outerElement.innerHTML = "Sorry, we couldn't retrieve the streams data this time";
				
			}

			// Don't move this, so the users can't select another category before the previous one loads.	
			activeTab = itemId;

	    },
	    error: function(e) {

	        console.log("sorry, we couldn't retrieve the data from de API at this time.");

	        //Here you can execute a fallback function or whatever you want in case there's no response from twitch

	    }
	});

}

/* Here we initialize the API calls */
apiCallStreams(apiCallUrl,'All');
apiCallSelection(apiSelectionUrl);
