(function(){
    twitch_streams.default.init({
        parentElement: 'outerAppContainer',//Pass here the ID of the container where the app should be rendered
        //loaderImage: './loader.gif', //Pass here the URL of a loader gif or image if you want to change the default one
        initActiveGame: 'Apex_Legends', //set here the name of the game that you wanna show as default
        // if you want to show the most popular streams as default just don't use the "initActiveGame" parameter
        showGamesBar: true, // Set this to false if you don't want to show the popular games list
        showStreams: true, // Set this to false if you don't want to show the streams
        streamsLimit: 15, //This sets the maximum number of streams to be shown
        onStreamClick: {
            //openStreamIn: 'newTab' // If you pass the 'newTab' parameter, the live streams will open in a different tab once the thumb is clicked
            openStreamIn: 'outerAppContainer'//You can also pass here the id of the container where you want to show the live stream
            //once the corresponding thumb is clicked
        },
        //if you go for the "openStreamIn" you need to pass the "closeStreamBtn"
        //in order to be able to close the stream
        closeStreamBtn: 'closeStreamButton'
    });

})();