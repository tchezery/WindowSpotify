const { app, BrowserWindow, ipcMain } = require('electron');
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');




const spotifyApi = new SpotifyWebApi({
    clientId: '1bdc621fcaa74a21a2c2f90b5b5f0cbc',
    clientSecret: '98ff8ac798da4d99aa6fc25d0fda8bb3',
    redirectUri: 'Http://localhost:8888/callback',
});

let window;



function CreateWindow() {
    window = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        } 
    });

    window.loadFile('index.html');
}

app.whenReady().then(CreateWindow);

ipcMain.handle('get-lyrics', async () => {
    try {
        const currentTrack = await spotifyApi.getMyCurrentPlayingTrack();
        console.log(currentTrack); 

        if (!currentTrack.body.is_playing) {
            return 'No music playing at this moment.';
        }

        const trackName = currentTrack.body.item.name;
        const artistName = currentTrack.body.item.artists[0].name;

        const lyrics = (await lyricsFinder(artistName, trackName)) || 'Lyrics not found.';
        return { trackName, artistName, lyrics };
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return 'Error to find lyrics.';
    }
});


