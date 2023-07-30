const express = require('express');
const app = express();
const port = 8080;

let songs = [
    {
        id: 1,
        title: "Super Shy",
        artists: [
            "New Jeans"
        ],
        url: "https://open.spotify.com/track/5sdQOyqq2IDhvmx2lHOpwd?si=004bd5dea37c4980"
    },
    {
        id: 2,
        title: "universe (sped up)",
        artists: [
            "thuy"
        ],
        url: "https://open.spotify.com/track/24kdDAmUUDwElZJ9NClVfP?si=c9d2c84226ff45a3"
    }
];

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html'); // define content hanya bisa pake cara ini (bisa jg tanpa ini/default content type)
    res.status(200);
    res.send(`
        <div>This text using html</div>
    `);
});

app.get('/songs', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send(songs);
});

app.get('/songs/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const songById = songs.filter((song) => song.id === id);

    if (songById.length === 0) {
        res.status(404);
        res.json({
            message: "Song with id " + id + " not found"
        });
    } else {
        res.status(200);
        res.json({
            message: "Success get song with id " + id,
            song: songById[0] // Since filter returns an array, take the first element
        });
    }
})

app.use(express.json()); // buat nerima body menjadi json
app.post('/newsong', (req, res) => {
    const title =  req.body.title;
    const artists = req.body.artists;
    const url = req.body.url;

    let maxIndex = Math.max(...songs.map((item) => item.id));
    const newSong = {
        id: (maxIndex = maxIndex + 1),
        title, 
        artists: [artists],
        url
    }
    songs.push(newSong);
    
    // opsi lain
    // songs.push({
    //     id: (maxIndex = maxIndex + 1),
    //     title, 
    //     artists: [],
    //     url
    // })
    res.send(songs);
});

app.put('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const songById = songs.findIndex((song) => song.id === id);

    if (songById === -1) {
        res.status(404);
        res.json({
            message: "Song with id " + id + " not found"
        });
    } else {
        songs[songById].title = req.body.title;
        songs[songById].artists = req.body.artists;
        songs[songById].url = req.body.url;

        res.status(200);
        res.json({
            message: "Successfully updated song with id " + id,
            updatedSong: songs[songById]
        });
    }
});

app.delete('/songs/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const songById = songs.find((song) => song.id === id);

    if (!songById) {
        res.status(404);
        res.json({
            message: "Song with id " + id + " not found"
        });
    } else {
        songs = songs.filter((song) => song.id !== id);

        res.status(200);
        res.json({
            message: "Successfully deleted song with id " + id,
            songById
        });
    }
})

app.listen(port, () => {
    console.log("Server running on port 8080")
});