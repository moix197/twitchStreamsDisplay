"use strict"
import loaderImg from './loader.gif';


const uiComponents = {
	parentElement: false,
	outerElement: false,
	loaderElement: false,
	btnElements: ['All'], //leave the All element, as it wont come from the API
	activeTab: false,
	streamsData: false,
	buttonsData: false,
	streamsLimit: false,
	loaderImage: false,
	openStreamIn: false,
	closeStreamBtn: false,

	initComponents({
		parentElement = false,
		initActiveGame = 'All',
		streamsLimit = 50,
		onStreamClick: {
			openStreamIn = false
		},
		loaderImage = loaderImg,
		closeStreamBtn
	}){
		this.streamsLimit = streamsLimit;
		this.parentElement = document.getElementById(parentElement);
		this.closeStreamBtn = closeStreamBtn;
		this.openStreamIn = openStreamIn;
		this.activeTab = initActiveGame;
		this.loaderImage = loaderImage;
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
		this.closeStreamBtn && this.setClickEvent(this.closeStreamBtn,() => {this.closeStreamBtnEvent()});
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
		document.getElementById('streamLiveVideoIframe').setAttribute('src', '');
		document.getElementById('streamLiveVideoIframe').classList.remove('openedStream');
		document.getElementById(this.closeStreamBtn).style.display = 'none';
		document.getElementById('outerStreamsIframe').style.display = "none";
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
				// we need to call it this way to assign the right context.
			});
		});

		this.setClickEvent('All',this.gamesClickEvents.bind(this));
	},

	handleStreams(){
		for(let i = 0; i < this.streamsLimit; i++){
			let element = this.streamsData.streams[i];	
			let streamId = element.channel.display_name.replace(/ /g,'_');
			this.renderSingleStream(element, streamId);				
			this.setClickEvent(streamId,() => {
				this.streamClickEvents(streamId);
				//as the streamClickEvents callback is using the "this" context
				// we need to call it this way to assign the right context.
			});
		}
	},

	gamesClickEvents(itemId){
        if(this.activeTab == itemId){
            return;
		}
		let prevActiveTab = document.getElementById(this.activeTab);
        prevActiveTab && prevActiveTab.classList.remove("selectedGame");
        document.getElementById(itemId).classList.add("selectedGame");
        this.activeTab = itemId;
        //the line below is for reseting the page before getting a new streams array
        this.outerElement.innerHTML = '';
        this.getOnlineStreams(itemId);
	},

	streamClickEvents(streamId){
		if(!this.openStreamIn){
			return;
		}else if(this.openStreamIn == 'newTab'){
			window.open(`https://www.twitch.tv/${streamId}`);
			return;
		}		
		streamId = streamId.split('_').join('%20');
		var	channel = `https://player.twitch.tv/?channel=${streamId}`;
		document.getElementById('streamLiveVideoIframe').setAttribute('src',channel);
		document.getElementById('streamLiveVideoIframe').classList.add('openedStream');
		document.getElementById('outerStreamsIframe').style.display = "block";
		document.getElementById(this.closeStreamBtn).style.display = 'block';
		document.getElementById('streamLiveVideoIframe').scrollIntoView({ behavior: 'smooth' });
	},
	
	renderSingleSelectionBtn(element,itemId){
        let selectionBtn = document.createElement('img');
		selectionBtn.setAttribute("src", element.game.box.medium);
		selectionBtn.setAttribute("class", "selectionBtn");
		selectionBtn.setAttribute("id", itemId);
		document.getElementById('outerGameSelection').append(selectionBtn);
		selectionBtn.setAttribute("alt", `${element.game.name}_SelectionBtn`);
		this.btnElements.push(itemId);
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
		if(this.openStreamIn && this.openStreamIn !== 'newTab'){
			document.getElementById(this.closeStreamBtn).classList.add("closeStreamBtn");
			let outerStreamsIframe = document.createElement('div');
			outerStreamsIframe.setAttribute('id','outerStreamsIframe');
			outerStreamsIframe.style.display = "none";
			this.parentElement.append(outerStreamsIframe);

			let streamLiveVideoIframe = document.createElement('iframe');
			streamLiveVideoIframe.setAttribute('id','streamLiveVideoIframe');
			streamLiveVideoIframe.setAttribute('frameborder','0');
			streamLiveVideoIframe.setAttribute('scrolling','no');
			streamLiveVideoIframe.setAttribute('allowfullscreen','true');
			outerStreamsIframe.append(streamLiveVideoIframe);
		}

		if( this.showGamesBar ){
			//if the option "showGamesBar" is passed as true in the new instance object
			//we create the element and append it
			let outerGameSelection = document.createElement('div');
			outerGameSelection.setAttribute("id", "outerGameSelection");
			this.parentElement.append(outerGameSelection);

			let gameSelectionAllBtn = document.createElement('button');
			gameSelectionAllBtn.innerHTML = 'All';
			gameSelectionAllBtn.className = 'selectionBtn'
			gameSelectionAllBtn.setAttribute('id', 'All');
			outerGameSelection.append(gameSelectionAllBtn);
		}

		if( this.showStreams ){
			//if the option "showStreams" is passed as true in the new instance object
			//we create the element and append it
			let outerStreams = document.createElement('div');
			outerStreams.setAttribute('id', 'outerStreams');
			outerStreams.className = 'outerStreamsMultiple'
			this.parentElement.append(outerStreams);

			let outerStreamLoaderImg = document.createElement('div');
			outerStreamLoaderImg.className = 'streamsLoader';
			outerStreamLoaderImg.setAttribute('id', 'streamsLoader');
			this.parentElement.append(outerStreamLoaderImg);

			let StreamLoaderImg = document.createElement('img');
			StreamLoaderImg.setAttribute('id', 'loaderGif');
			StreamLoaderImg.setAttribute('src', this.loaderImage);
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