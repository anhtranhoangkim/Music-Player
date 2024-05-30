const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const playingSongName = $('.playing-song-name')
const playingSongArtist = $('.playing-song-artist')
const cdThumbnail = $('.cd-thumbnail')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')


const app = {
    currentIndex: 0,
    isPlaying: false,

    songs: [
        {
            name: "TruE",
            singer: "HOYO-MiX · 黄龄 · 文驰 · TetraCalyx",
            path: "./assets/songs/TruE.mp3",
            image: "./assets/img/TruE.jpg"
        },
        {
            name: "Regression",
            singer: "Ayanga",
            path: "./assets/songs/Regression - Honkai Impact 3rd Theme Song Performed by- Ayanga - Honkai Impact 3rd.mp3",
            image: "./assets/img/Regression.jpg"
        },
        {
            name: "Rubia",
            singer: "Zhou Shen",
            path: "./assets/songs/Rubia (Performed by Zhou Shen) - Honkai Impact 3rd.mp3",
            image: "./assets/img/Rubia.jpg"
        },
        {
            name: "Starfall",
            singer: "TIA RAY",
            path: "./assets/songs/[Starfall] (Performed by TIA RAY) - Honkai Impact 3rd OST.mp3",
            image: "./assets/img/Starfall.jpg"
        },
        {
            name: "Moon Halo",
            singer: "茶理理 x TetraCalyx x Hanser",
            path: "./assets/songs/Moon Halo - Honkai Impact 3rd Valkyrie Theme.mp3",
            image: "./assets/img/Moon Halo.jpg"
        },
        {
            name: "Houkai Sekai no Utahime (Honkai World Diva)",
            singer: "Mika Kobayashi",
            path: "./assets/songs/Houkai Sekai no Utahime (Honkai World Diva, movie ver.)-- Honkai Impact 3rd.mp3",
            image: "./assets/img/Houkai Sekai no Utahime.jpg"
        },
        {
            name: "Dual-Ego",
            singer: "Sa Dingding",
            path: "./assets/songs/Dual-Ego Honkai Impact 3rd OSTBy Sa Dingding.mp3",
            image: "./assets/img/Dual-Ego.jpg"
        },
        {
            name: "Da Capo",
            singer: "车子玉Ziyu Che",
            path: "./assets/songs/Da Capo  Honkai Impact 3rd Theme Song.mp3",
            image: "./assets/img/Da Capo.jpg"
        },
        {
            name: "Cyberangel",
            singer: "Hanser",
            path: "./assets/songs/Cyberangel Honkai Impact 3rd OSTBy Hanser.mp3",
            image: "./assets/img/Cyberangel.webp"
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song">
                <div class="song-contain">
                    <span class="song-number">${index + 1}</span>
                    <div class="song-img" style="background-image: url('${song.image}')" alt="" class="song-image"></div>
                    <div class="song-text">
                        <h5 class="song-name">${song.name}</h5>
                        <p class="song-artist">${song.singer}</p>
                    </div>
                </div>

                <div class="song-contain song-select">
                <!-- <span class="song-duration">${song.duration}</span> -->
                    <div>
                        <i class="song-favorite fa-regular fa-heart"></i>
                        <i class="song-option fa-solid fa-ellipsis-vertical"></i>
                    </div>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    // getDuration: function(index) {
    //     const audio = new Audio(this.songs[index].path);

    //     audio.setAttribute('preload', "metadata")

    //     console.log(audio)
    //     console.log(audio.duration)

    //     audio.addEventListener("loadedmetadata", (e) => {
    //         console.log(e)
    //     }, false)
    // },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        //load song

        // click play btn
        playBtn.onclick = function() {
            console.log(playBtn)
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function() {
            app.isPlaying = true
            playBtn.classList.add('song-playing')
        }

        audio.onpause = function() {
            app.isPlaying = false
            playBtn.classList.remove('song-playing')
        }

    },

    loadCurrentSong: function() {
        playingSongName.textContent = this.currentSong.name
        playingSongArtist.textContent = this.currentSong.singer
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    start: function() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        
    }
}

app.start()