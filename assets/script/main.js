const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "CATCH ME IF YOU CAN",
            singer: "Negav, Quang Hùng MasterD, Nicky, Công Dương",
            path: "./assets/music/CATCHMEIFYOUCAN.mp3",
            image: "./assets/img/CatchMeIfYouCan-img.jpg",
        },
        {
            name: "CỨ ĐỂ ANH TA RỜI ĐI",
            singer: "Bảo Anh, Dương Domic, Quang Hùng MasterD, Lou Hoàng, Song Luân",
            path: "./assets/music/CUDEANHTAROIDI.mp3",
            image: "./assets/img/CuDeAnhTaRoiDi-img.jpg",
        },
        {
            name: "HÀO QUANG",
            singer: "Rhyder, Dương Domic, Pháp Kiều",
            path: "./assets/music/HAOQUANG.mp3",
            image: "./assets/img/HaoQuang-img.jpg",
        },
        {
            name: "HÚT",
            singer: "Quân A.P, Lou Hoàng, Nicky, Hải Đăng Doo, WEAN, Ali Hoàng Dương, Pháp Kiều",
            path: "./assets/music/HUT.mp3",
            image: "./assets/img/Hut-img.jpg",
        },
        {
            name: "NGÁO NGƠ",
            singer: "HIEUTHUHAI, Atus, Jsol, Erik",
            path: "./assets/music/NGAONGO.mp3",
            image: "./assets/img/NgaoNgo-img.jpg",
        },
        {
            name: "REGRET",
            singer: "Lâm Bảo Ngọc, Quân A.P, Pháp Kiều, Quang Trung, Ali Hoàng Dương",
            path: "./assets/music/REGRET.mp3",
            image: "./assets/img/Regret-img.jpg",
        },
        {
            name: "YOU",
            singer: "Song Luân, Atus, Captain, Quang Trung",
            path: "./assets/music/YOU.mp3",
            image: "./assets/img/You-img.jpg",
        },
        {
            name: "LOVE SAND",
            singer: "HIEUTHUHAI, Jsol, Ali Hoàng Dương, Vũ Thịnh",
            path: "./assets/music/LOVESAND.mp3",
            image: "./assets/img/LoveSand-img.jpg",
        },
    ],
    //Hàm render bài hát
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${
                index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>  
            `;
        })
        $('.playlist').innerHTML = htmls.join("");
    },

    definePropert: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function() {
        //this ở đây là handle events được gán vào _this
        const _this = this; 
        // Xử lý phóng to, thu nhỏ CD khi scroll
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' },
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        }) 
        cdThumbAnimate.pause();

        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // Xử lý khi click play
        playBtn.onclick = function() {
            //this ở đây là playBtn nên dùng _this để sử dụng thằng ở ngoài
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        };
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration !== NaN) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        };
        // Xử lý khi click vào playlist
        playlist.onclick = function(e) {
            if(e.target.classList.contains('song')) {
                const songIndex = parseInt(e.target.dataset.index);
                _this.currentIndex = songIndex;
                _this.loadCurrentSong();
                audio.src = _this.currentSong.path;
                if(_this.isPlaying) {
                    audio.play();
                }
            }
        };
        // Xử lý khi tua song 
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        };
        // Xử lý khi next song 
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
        };
        // Xử lý khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
        };
        // Xử lý bật / tắt random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Xử lý khi repeat song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.definePropert()
        // Lắng nghe và xử lý các sự kiện
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi load app
        this.loadCurrentSong();
        // Render playlist
        this.render();
    },

    
}
app.start();