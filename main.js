// bind querySelector
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// storage key
const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

// define variables
const playlist = $('.playlist')
const playingSongName = $('.playing-song-name')
const playingSongArtist = $('.playing-song-artist')
const cdThumbnail = $('.cd-thumbnail')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn  = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const shuffleBtn = $('.btn-shuffle')
const song = $$('.song')
var shuffleArray = []


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "TruE",
            singer: "HOYO-MiX · 黄龄 · 文驰 · TetraCalyx",
            path: "./assets/songs/TruE.mp3",
            image: "./assets/img/TruE.jpg",
            isFavorite: false
        },
        {
            name: "Regression",
            singer: "Ayanga",
            path: "./assets/songs/Regression - Honkai Impact 3rd Theme Song Performed by- Ayanga - Honkai Impact 3rd.mp3",
            image: "./assets/img/Regression.jpg",
            isFavorite: false
        },
        {
            name: "Rubia",
            singer: "Zhou Shen",
            path: "./assets/songs/Rubia (Performed by Zhou Shen) - Honkai Impact 3rd.mp3",
            image: "./assets/img/Rubia.jpg",
            isFavorite: false
        },
        {
            name: "Starfall",
            singer: "TIA RAY",
            path: "./assets/songs/[Starfall] (Performed by TIA RAY) - Honkai Impact 3rd OST.mp3",
            image: "./assets/img/Starfall.jpg",
            isFavorite: false
        },
        {
            name: "Moon Halo",
            singer: "茶理理 x TetraCalyx x Hanser",
            path: "./assets/songs/Moon Halo - Honkai Impact 3rd Valkyrie Theme.mp3",
            image: "./assets/img/Moon Halo.jpg",
            isFavorite: false
        },
        {
            name: "Houkai Sekai no Utahime (Honkai World Diva)",
            singer: "Mika Kobayashi",
            path: "./assets/songs/Houkai Sekai no Utahime (Honkai World Diva, movie ver.)-- Honkai Impact 3rd.mp3",
            image: "./assets/img/Houkai Sekai no Utahime.jpg",
            isFavorite: false
        },
        {
            name: "Dual-Ego",
            singer: "Sa Dingding",
            path: "./assets/songs/Dual-Ego Honkai Impact 3rd OSTBy Sa Dingding.mp3",
            image: "./assets/img/Dual-Ego.jpg",
            isFavorite: false
        },
        {
            name: "Da Capo",
            singer: "车子玉Ziyu Che",
            path: "./assets/songs/Da Capo  Honkai Impact 3rd Theme Song.mp3",
            image: "./assets/img/Da Capo.jpg",
            isFavorite: false
        },
        {
            name: "Cyberangel",
            singer: "Hanser",
            path: "./assets/songs/Cyberangel Honkai Impact 3rd OSTBy Hanser.mp3",
            image: "./assets/img/Cyberangel.webp",
            isFavorite: false
        }
    ],

    // set config for app
    setConfig: function(key, value) {
        this.configs[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.configs))
    },
    
    // render songs in above array to html
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="song-contain">
                    <div class="song-img" style="background-image: url('${song.image}')" alt="" class="song-image"></div>
                    <div class="song-text">
                        <h5 class="song-name">${song.name}</h5>
                        <p class="song-artist">${song.singer}</p>
                    </div>
                </div>

                <div class="song-contain song-select">
                    <div>
                        <i class="song-favorite-${index} btn song-favorite fa-regular fa-heart" onclick="handleFavorite(event)"></i>
                        <i class="btn song-remove-${index} fa-solid fa-xmark" onclick="handleRemove(event)"></i>
                    </div>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        // play button
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function() {
            app.isPlaying = true
            playBtn.classList.add('song-playing')
            cdThumbAni.play()
        }

        audio.onpause = function() {
            app.isPlaying = false
            playBtn.classList.remove('song-playing')
            cdThumbAni.pause()
        }

        // rotate cd
        const cdThumbAni = cdThumbnail.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAni.pause()

        // track song progress
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // seek 
        progress.oninput = function(e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // next button
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()    
        }

        // previous button
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
        }

        // repeat button
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // shuffle button
        shuffleBtn.onclick = function(e) {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            shuffleBtn.classList.toggle('active', app.isRandom)
        }

        // next song when ended
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // click playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            var songs = $$('.song')
            songs[app.currentIndex].classList.remove('active')
            

            if (songNode || e.target.closest('.option')) {
                // Clicked on a song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    songs[app.currentIndex].classList.add('active')
                    app.loadCurrentSong();
                    audio.play();
                }
            }   
        }
    },

    // load current song based on current index
    loadCurrentSong: function() {
        playingSongName.textContent = this.currentSong.name
        playingSongArtist.textContent = this.currentSong.singer
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    // load all configs of app
    loadConfig: function() {
        this.isRandom = this.configs.isRandom
        this.isRepeat = this.configs.isRepeat

        if (app.isRepeat) {
            repeatBtn.classList.add('active')
        }

        if (app.isRandom) {
            shuffleBtn.classList.add('active')
        }
    },

    // handle nextSong event
    nextSong: function() {
        let songs = $$('.song')
        songs[this.currentIndex].classList.remove('active')

        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        songs[this.currentIndex].classList.add('active')
        this.loadCurrentSong()
    },

    // handle prevSong event
    prevSong: function() {
        let songs = $$('.song')
        songs[this.currentIndex].classList.remove('active')

        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        songs[this.currentIndex].classList.add('active')
        this.loadCurrentSong()
    },

    // handle randomSong event using fisher-Yates (aka Knuth) Shuffle algorithm
    randomSong: function() {
        let songs = $$('.song')
        songs[this.currentIndex].classList.remove('active')
        // If all songs have been played, reshuffle the array
        if (shuffleArray.length === 0) {
            shuffleArray = [...this.songs]; // Copy the songs array
            for (let i = shuffleArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]]; // Swap elements
            }
        }

        // Get the next song from the shuffled array
        const nextSong = shuffleArray.pop();

        // Update the current index and load the song
        this.currentIndex = this.songs.indexOf(nextSong);
        songs[this.currentIndex].classList.add('active')
        this.loadCurrentSong();
    },

    // handle events when starting app
    start: function() {
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
}

// handle event when clicking favorite (heart) icon
function handleFavorite(event) {
    event.stopPropagation()
    const songElement = event.target.closest('.song')
    const dataIndex = songElement.dataset.index;
    const favBtn = $(`.song-favorite-${dataIndex}`)

    if (!app.songs[dataIndex].isFavorite) {
        favBtn.classList.replace("fa-regular", "fa-solid")
        app.songs[dataIndex].isFavorite = true;
    } else {
        favBtn.classList.replace("fa-solid", "fa-regular")
        app.songs[dataIndex].isFavorite = false;
    }
}

// handle event when clicking remove (delete) icon
function handleRemove(event) {
    event.stopPropagation()
    const songElement = event.target.closest('.song')
    const dataIndex = songElement.dataset.index;
    const removeBtn = $(`.song-remove-${dataIndex}`)

    const removeSong = removeBtn.closest('.song')
    app.songs.splice(removeSong, 1)
    removeSong.style.display = 'none'
}

// starto
app.start()
