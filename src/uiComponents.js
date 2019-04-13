"use strict"
import loaderImg from './loader.gif';

const uiComponents = {
	parentElement: false,
	outerElement: false,
	loaderElement: false,
	btnElements: ['All'], //leave the All element, as it wont come from the API
	activeTab: 'All',//this is the default activeTab, leave it as it's
	streamsData: false,
	buttonsData: false,

	initComponents(element){
		this.parentElement = document.getElementById(element);
		this.initialRender();
		this.outerElement = document.getElementById('outerStreams');
		this.loaderElement = document.getElementById('streamsLoader');
	},

	initGamesSelectionBar(data){
        this.buttonsData = data;
		this.handleSelectionBtns();
		// if you want to do something else with the game buttons you can add it here
	},

	initStreams(data){
		this.streamsData = data;
		this.handleStreams();
		this.setClickEvent('closeStream',this.closeStreamBtnEvent);
		this.loaderElement.style.display = "none";
		// if you want to do something else with the streams you can add it here
	},

	setClickEvent(itemID,callback){
		document.getElementById(itemID).addEventListener("click", (e) => {
			callback(itemID);
		});
	},

	closeStreamBtnEvent(){
		document.getElementById('outerGameSelection').scrollIntoView({ behavior: 'smooth' });
		document.getElementById('liveVideoIframe').setAttribute('src', '');
		document.getElementById('outerIframe').classList.remove('openedStream');
		document.getElementById('closeStream').style.display = 'none';
	},

	streamClickEvents(streamId){
		streamId = streamId.split('_').join('%20');
		var	channel = 'https://player.twitch.tv/?channel='+streamId;
		document.getElementById('liveVideoIframe').setAttribute('src',channel);
		document.getElementById('outerIframe').classList.add('openedStream');
		document.getElementById('closeStream').style.display = 'block';
		document.getElementById('liveVideoIframe').scrollIntoView({ behavior: 'smooth' });
	},
	
	gamesClickEvents(itemId){
        if(this.activeTab == itemId){
            return;
        }
        let gameName = itemId.replace(/_/g,'%20');

        if(gameName == 'All'){
            this.apiCallUrl = 'https://api.twitch.tv/kraken/streams?client_id=kcrh2z2tj9qqs1asztf6n755zmwspns'; //replace the {CLIENT_ID_HERE} with your twitch API client id
        }else{
            this.apiCallUrl = 'https://api.twitch.tv/kraken/streams?game='+gameName+'&client_id=kcrh2z2tj9qqs1asztf6n755zmwspns'; //replace the {CLIENT_ID_HERE} with your twitch API client id
        }
        
        document.getElementById(this.activeTab).classList.remove("selectedGame");
        document.getElementById(itemId).classList.add("selectedGame");
        this.activeTab = itemId;
        //the line below is for reseting the page before getting a new streams array
        this.outerElement.innerHTML = '';
        this.getOnlineStreams(itemId);
	},

	handleSelectionBtns(){
		//here we map through the streams array to render each stream and
        //set the proper click event.
		this.buttonsData.top.map((element) =>{
            let itemId = element.game.name.replace(/ /g,'_');
			this.renderSingleSelectionBtn(element,itemId);
			this.setClickEvent(itemId,(item) => {
				this.gamesClickEvents(item);
				//as the gamesClickEvents callback is using the "this" context
				// we need to call it this way to assign the right context,
				// you also have the option to bind the "this" context as I did
				//in the line 88. ussually you want your code to be consistent
				// but here I'm using the two methods just for explanation purposes.
			});
		});

		this.setClickEvent('All',this.gamesClickEvents.bind(this));
	},

	renderSingleSelectionBtn(element,itemId){

        let selectionBtn = document.createElement('img');
		selectionBtn.setAttribute("src", element.game.box.medium);
		selectionBtn.setAttribute("class", "selectionBtn");
		selectionBtn.setAttribute("id", itemId);
		document.getElementById('outerGameSelection').append(selectionBtn);
		selectionBtn.setAttribute("alt", element.game.name+"_SelectionBtn");
		this.btnElements.push(itemId);
		
	},

	handleStreams(){
		//here we map through the streams array to render each stream and
		//set the proper click event.
		this.streamsData.streams.map((element) => {
			var streamId = element.channel.display_name.replace(/ /g,'_');
			this.renderSingleStream(element, streamId);				
			this.setClickEvent(streamId,this.streamClickEvents);
		});
	},

	renderSingleStream(element, streamId){
			/*Here we render the streams and append all the divs to the HTML document.*/
			let SingleStream = document.createElement('div');
			SingleStream.setAttribute("class", "singleStream");
			SingleStream.setAttribute("id", streamId);
	
			let streamDetails = document.createElement('div');
			streamDetails.setAttribute("class", "streamDetails");
	
			let outerImageStream = document.createElement('div');
			outerImageStream.setAttribute("class", "outerImageStream");
			let imageStream = document.createElement('img');
			imageStream.src = element.preview.medium;
	
			let gameContainer = document.createElement('div');
			gameContainer.setAttribute("class", "titleName gameName");
			let gameLayoutContainer = document.createElement('p');
			gameLayoutContainer.innerHTML = 'Game: ';
			let gameNameContainer = document.createElement('p');
			
			let playerContainer = document.createElement('div');
			playerContainer.setAttribute("class", "titleName");
			let playerLayoutContainer = document.createElement('p');
			playerLayoutContainer.innerHTML = 'User: ';
			let playerNameContainer = document.createElement('p');
			
			let languageContainer = document.createElement('div');
			languageContainer.setAttribute("class", "titleName");
			let languageLayoutContainer = document.createElement('p');
			languageLayoutContainer.innerHTML = 'Language: ';
			let languageNameContainer = document.createElement('p');
			
			let viewersContainer = document.createElement('div');
			viewersContainer.setAttribute("class", "titleName");
			let viewersLayoutContainer = document.createElement('p');
			viewersLayoutContainer.innerHTML = 'Viewers: ';
			let viewersNameContainer = document.createElement('p');
			
			this.outerElement.append(SingleStream);
				SingleStream.append(imageStream);
				SingleStream.append(outerImageStream);
				SingleStream.append(streamDetails);
					outerImageStream.append(imageStream);
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
	},

	initialRender(){
		if( this.showGamesBar ){
			//if the option "showGamesBar" is passed as true in the new instance object
			//we create the element and append it
			let outerGameSelection = document.createElement('div');
			outerGameSelection.setAttribute("id", "outerGameSelection");
			this.parentElement.append(outerGameSelection);

			let gameSelectionAllBtn = document.createElement('button');
			gameSelectionAllBtn.innerHTML = 'All';
			gameSelectionAllBtn.className = 'selectionBtn selectedGame'
			gameSelectionAllBtn.setAttribute('id', 'All');
			outerGameSelection.append(gameSelectionAllBtn);
		}

		if( this.showStreams ){
			//if the option "showStreams" is passed as true in the new instance object
			//we create the element and append it
			let outerStreams = document.createElement('div');
			outerStreams.setAttribute('id', 'outerStreams');
			this.parentElement.append(outerStreams);

			let outerStreamLoaderImg = document.createElement('div');
			outerStreamLoaderImg.className = 'streamsLoader';
			outerStreamLoaderImg.setAttribute('id', 'streamsLoader');
			this.parentElement.append(outerStreamLoaderImg);

			let StreamLoaderImg = document.createElement('img');
			StreamLoaderImg.setAttribute('id', 'loaderGif');
			StreamLoaderImg.setAttribute('src', loaderImg);
			outerStreamLoaderImg.append(StreamLoaderImg);
		}

		
	},

	initFallback(){
		//Fallback in case the API response is empty
		this.loaderElement.style.display = "none";
		this.outerElement.innerHTML = "Sorry, we couldn't retrieve the streams data this time";
		// Don't move this, so the users can't select another category before the previous one loads.	
		this.activeTab = 'All';
	}
}

export default uiComponents;