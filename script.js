let i = 0;
let s = 0;
let e = 0;
let separatorCount = 74;
let signatureCount = 0;
let nameCount = 0;
let aliasCount = 0;
let nameText = ''
let aliasText = ''
let dataFriends = null
let signatureText = ''
let isOverTitle = null
let title = 'CV.CORP(R) CV-DOS(TM)\nXATSPACE V20.23\n(C)CV-CRYSTAL CORP 2000-2023\nAUTHOR:LALA\n***********************************************************************';
let contain = "No, this ain't heavy metal!\nNO, THIS AIN'T HEAVY METAL!!!!!!";
let emoLetters = "Don't give a fuck if my heart stops beating"
let happyLetters = "D-Generation\nWho's keep the score?"
let speed = 60;
let currentIndex
let reproducido = false
let reproducido2 = false
let boton = null
let Playlist
let Player
let state = false;


const request = new XMLHttpRequest();
request.overrideMimeType("application/json");
request.open('GET', 'friends.json', true);
request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
        const data = JSON.parse(request.responseText);
        dataFriends = data
    }
};
request.send(null);


window.addEventListener("load", () => {
    showPopup()
    setTimeout(() => {
        showPopupMackenzie()
    }, 500);
    setTimeout(() => {
        showPopupOrgtx('popupOrgtx', 6000)
    }, 1000);


    const span = document.getElementById('aboutMe');
    span.textContent = emoLetters;
    boton = document.getElementById("button-ad")
    let galleryItems = document.querySelectorAll('.image');
    const imageProfile = document.querySelector('.profile');
    const checkbox = document.getElementById('example_square_5');
    typeWriter()
        /**
         *@function Playlist
         *Function for all of the playlist manipulation & functionalities
         */
    Playlist = (function(w, d, $, pub) {
        var list = [];

        pub.addSong = function(title, artist, image, source) {
            var song = {};
            song["title"] = title;
            song["artist"] = artist;
            song["image"] = image;
            song["source"] = source;

            list.push(song);
        };

        pub.getSong = function(index) {
            return list[index];
        };

        pub.getPlaylistLength = function() {
            return list.length;
        };

        return pub;
    })(window, document, jQuery, {});

    /**
     *@function Player
     *FUNCION DE REPRO DE MUSICA
     */
    Player = (function(w, d, $, pub) {
        var index = 0,
            audio = [],
            ticker = "",
            currMin = 0,
            currSec = 0,
            totalSec = 1, //Start at 1 to remove transition delay
            songDur = 0,
            songDurSec = 0,
            $duration = $(".duration"),
            $currPos = $(".duration .currPos"),
            $playPause = $(".playPauseBtn"),
            $next = $(".addtControls .next"),
            $prev = $(".addtControls .prev"),
            $loop = $(".addtControls .loop"),
            $title = $(".titleArtist .title"),
            $artist = $(".titleArtist .artist"),
            $featureImg = $(".featureImg"),
            $currTime = $(".timeLogs .currTime"),
            $totalDuration = $(".timeLogs .totalDuration");

        function checkOverflow(el) {
            var curOverflow = el.style.overflow;
            if (!curOverflow || curOverflow === "visible") el.style.overflow = "hidden";

            var isOverflowing =
                el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

            el.style.overflow = curOverflow;

            return isOverflowing;
        }

        pub.init = function() {
            $playPause.click(this.playPauseClick);
            $prev.click(this.prevSong);
            $next.click(this.nextSong);
            $loop.click(this.loopClick);
            $duration.click(this.jumpSong);
            pub.loadSong(false);
        };

        pub.playPauseClick = function() {
            var play = $playPause.hasClass("play");

            if (play) {
                Player.playSong();
                $playPause.removeClass("play").addClass("pause");
            } else {
                Player.pauseSong();
                $playPause.removeClass("pause").addClass("play");
            }
        };

        pub.loadSong = function(play) {
            var song = Playlist.getSong(index);

            if (!audio[index]) {
                audio[index] = new Audio();
                audio[index].src = song.source;
                audio[index].addEventListener("loadedmetadata", function() {
                    var seconds = audio[index].duration,
                        duration;
                    seconds = Math.floor(seconds);

                    if (seconds < 60) {
                        duration = "0:" + seconds;
                    } else {
                        var min = Math.floor(seconds / 60),
                            sec = seconds % 60;

                        if (sec < 10) {
                            sec = "0" + sec;
                        }
                        duration = min + ":" + sec;
                    }

                    songDur = duration;
                    songDurSec = seconds;
                    $totalDuration.text(duration);
                });
            }
            audio[index].load();

            $title.text(song.title);
            $artist.text(song.artist);
            $featureImg.css("background-image", "url('" + song.image + "')");
            $currTime.text("0:00");

            // Variable Resets
            currMin = 0;
            currSec = 0;
            totalSec = 1;

            // Reset Cur Pos Bar
            $currPos.css("width", "0%");

            this.detectOverflow();

            if (play) {
                this.playSong();
            }
        };

        pub.updateCurrPos = function() {
            var percentage = (totalSec / songDurSec) * 100;
            percentage = percentage > 100 ? 100 : percentage;

            $currPos.css("width", percentage + "%");
        };

        pub.jumpSong = function(e) {
            var x = e.pageX - $duration.offset().left,
                width = $duration.outerWidth(),
                percentage = x / width,
                percentageWidth = percentage * 100,
                pixelWidth = width * percentage,
                songPos = Math.round(songDurSec * percentage),
                posMin = Math.floor(songPos / 60),
                posSec = songPos % 60 < 10 ? "0" + (songPos % 60) : songPos % 60;

            Player.pauseSong();

            $currPos.removeClass("animate");
            $currPos.css("width", percentageWidth + "%");

            $currTime.text(posMin + ":" + posSec);

            audio[index].currentTime = songPos;

            // Interval to wait for currPos bar to jump to position without animation
            var interval = setInterval(function() {
                if ($currPos.outerWidth() == pixelWidth) {
                    clearInterval(interval);
                    $playPause.removeClass("play").addClass("pause");
                    Player.playSong();
                }
            }, 10);
        };

        pub.startTicker = function() {
            ticker = setInterval(function() {
                var time, currSec, sec, min;

                currSec = audio[index].currentTime;
                min = Math.floor(currSec / 60);
                sec = Math.round(currSec % 60);
                totalSec = currSec;

                if (sec < 10) {
                    time = min + ":0" + sec;
                    $currTime.text(time);
                } else {
                    time = min + ":" + sec;
                    $currTime.text(time);
                }

                Player.updateCurrPos();

                if (time == songDur) {
                    Player.pauseTicker();

                    if (index != Playlist.getPlaylistLength() - 1) {
                        index++;
                        Player.loadSong(true);
                    } else if ($loop.hasClass("active")) {
                        index = 0; // Reset to Start
                        Player.loadSong(true);
                    } else {
                        $playPause.removeClass("pause").addClass("play");
                    }
                }
            }, 1000);
        };

        pub.pauseTicker = function() {
            clearInterval(ticker);
        };

        pub.detectOverflow = function() {
            if ($title.text().length > 12) {
                setTimeout(() => {
                    $title.marquee({
                        //speed in milliseconds of the marquee
                        duration: 3500,
                        //gap in pixels between the tickers
                        gap: 50,
                        //time in milliseconds before the marquee will start animating
                        delayBeforeStart: 50,
                        //'left' or 'right'
                        direction: "left",
                        //true or false - should the marquee be duplicated to show an effect of continues flow
                        duplicated: true
                    });
                }, 0);

            }
        };

        pub.playSong = function() {
            audio[index].play();
            $currPos.addClass("animate");
            this.startTicker();
        };

        pub.pauseSong = function() {
            audio[index].pause();
            $currPos.addClass("animate");
            this.pauseTicker();
        };

        pub.nextSong = function() {
            Player.pauseSong();

            index = index == Playlist.getPlaylistLength() - 1 ? 0 : index + 1;
            if ($playPause.hasClass("play")) {
                Player.loadSong(false);
            } else {
                Player.loadSong(true);
            }
        };

        pub.prevSong = function() {
            Player.pauseSong();

            if (audio[index].currentTime < 5) {
                index = index == 0 ? Playlist.getPlaylistLength() - 1 : index - 1;
                if ($playPause.hasClass("play")) {
                    Player.loadSong(false);
                } else {
                    Player.loadSong(true);
                }
            } else {
                audio[index].currentTime = 0;

                $currPos.removeClass("animate");
                $currPos.css("width", "0");

                $currTime.text("0:00");

                var interval = setInterval(function() {
                    if ($currPos.outerWidth() == "0") {
                        clearInterval(interval);
                        $playPause.removeClass("play").addClass("pause");
                        Player.playSong();
                    }
                }, 10);
            }
        };

        pub.loopClick = function() {
            if ($loop.hasClass("active")) {
                $loop.removeClass("active");
            } else {
                $loop.addClass("active");
            }
        };

        return pub;
    })(window, document, jQuery, {});

    // PUSHEAN CANCIONES
    Playlist.addSong(
        "DArkside",
        "Bring me the horizon",
        "assets/disc/darkside.png",
        "assets/songs/darskide.mp3?raw=true"
    );
    Playlist.addSong(
        "Run",
        "Bring me the horizon",
        "assets/disc/spirit.png",
        "assets/songs/Run.mp3?raw=true"
    );
    Playlist.addSong(
        "Never find me",
        "Korn",
        "assets/disc/neverfindme.png",
        "assets/songs/neverfindme.mp3?raw=true"
    );
    Playlist.addSong(
        "Forgotten",
        "Korn",
        "assets/disc/rekiem.png",
        "assets/songs/forgotten.mp3?raw=true"
    );
    Playlist.addSong(
        "Crucified",
        "Ghost",
        "assets/disc/ghost.png",
        "assets/songs/crucified.mp3?raw=true"
    );
    Playlist.addSong(
        "Kool-Aid",
        "Bring me the horizon",
        "assets/disc/koolaid.png",
        "assets/songs/koolaid.mp3?raw=true"
    );
    Playlist.addSong(
        "Bad Habits",
        "Ed Sheeran",
        "assets/disc/badhabits.png",
        "assets/songs/badhabits.mp3?raw=true"
    );
    Playlist.addSong(
        "In the dark",
        "Bring me the horizon",
        "assets/disc/amo.png",
        "assets/songs/inthedark.mp3?raw=true"
    );
    Playlist.addSong(
        "Heavy Metal",
        "Bring me the horizon",
        "assets/disc/amo.png",
        "assets/songs/HeavyMetal.mp3?raw=true"
    );
    Playlist.addSong(
        "This fire burns",
        "Killswitch Engage",
        "assets/disc/ke.jpg",
        "assets/songs/thisfire.mp3?raw=true"
    );
    Playlist.addSong(
        "Days of the phoenix",
        "A Fire Inside",
        "assets/disc/aod.png",
        "assets/songs/daysofthephoenix.mp3?raw=true"
    );
    Playlist.addSong(
        "There's no going back",
        "Sick Puppies",
        "assets/disc/connect.png",
        "assets/songs/tngb.mp3?raw=true"
    );
    Playlist.addSong(
        "Sugar Honey Ice Tea",
        "Bring me the horizon",
        "assets/disc/amo.png",
        "assets/songs/shit.mp3?raw=true"
    );
    Playlist.addSong(
        "Fine again",
        "Seether",
        "assets/disc/disclaimer.png",
        "assets/songs/fa.mp3?raw=true"
    );
    Playlist.addSong(
        "Trash",
        "Korn",
        "assets/disc/issues.png",
        "assets/songs/trash.mp3?raw=true"
    );


    // INICIAR PLAYLIST
    Player.init();

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            resetHtml()
            const demo = document.getElementById("demo")
            const contain = document.getElementById("contain")
            demo.classList.add("hidden");
            contain.classList.add("hidden");
            const fiends = document.getElementById("fiends")
            const signature = document.getElementById("signature")
            const special = document.getElementById("special")

            signatureCount = 0
            nameCount = 0
            aliasCount = 0
            document.getElementById("name").textContent = ''
            document.getElementById("alias").textContent = ''
            document.getElementById("signature-text").textContent = ''
            nameText = ''
            aliasText = ''
            signatureText = ''
            const imgSrc = item.querySelector('img').src
            imageProfile.src = imgSrc
            nameText = dataFriends[index].nombre
            aliasText = dataFriends[index].alias
            signatureText = dataFriends[index].dedicatoria
            if (currentIndex === index) {
                // if (index === 15) {
                //     fiends.classList.add("hidden");
                //     special.classList.add("hidden");
                // } 
                fiends.classList.add("hidden");
                signature.classList.add("hidden");
                i = 0;
                s = 0;
                e = 0
                demo.classList.remove("hidden");
                contain.classList.remove("hidden");
                currentIndex = null
                typeWriter()
            } else {
                // if (index === 15) {
                //     fiends.classList.remove("hidden");
                //     special.classList.remove("hidden");
                // } else {
                fiends.classList.remove("hidden");
                signature.classList.remove("hidden");
                typeWriterNameText()
                currentIndex = index
            }


            // typeWriterSignature()
        });
    });



    // Función para manejar el cambio en el checkbox
    function cambioCheckbox() {

        if (!reproducido) {
            Player.playSong();
        }
        const body = document.body;
        body.classList.toggle("modo-oscuro");
        const icon = document.getElementById("icon");
        // Cambiar variables CSS según el modo
        // const isDarkMode = body.classList.contains("modo-oscuro");
        reproducido = true
        if (!checkbox.checked) {
            document.documentElement.style.setProperty('--color-fondo-claro', '#52295');
            span.textContent = happyLetters;
            icon.classList.remove("icon-dark");
            icon.classList.add("icon-claro");
        } else {
            document.documentElement.style.setProperty(' --color-fondo-oscuro', '#000');

            span.textContent = emoLetters;
            icon.classList.remove("icon-claro");
            icon.classList.add("icon-dark");
        }
    }

    // Agregar un event listener para capturar el cambio en el checkbox
    checkbox.addEventListener('change', cambioCheckbox);
    document.getElementById('coinMaster').addEventListener('click', function() {
        const eigthbits = document.getElementById("8-bits-space");
        const normalSpace = document.getElementById("content-black-space");
        if (!reproducido2) {
            Player.playSong();
        }
        reproducido2 = true
        state = !state
        if (state) {
            normalSpace.classList.remove("show");
            normalSpace.classList.add("hidden");
            eigthbits.classList.add("show");
        } else {
            eigthbits.classList.remove("show");
            normalSpace.classList.add("show");
            eigthbits.classList.add("hidden");
        }
    });
});

function toggleDarkMode() {

}

function resetHtml() {
    document.getElementById("demo").textContent = ''
    document.getElementById("contain").textContent = ''
}


function typeWriter() {

    if (i < title.length) {
        document.getElementById("demo").innerHTML += title.charAt(i);
        i++;
        if (i === title.length) {
            typeWriterContain()
        }
        setTimeout(typeWriter, speed);

    }
}


// FUNCIONES DE AUTOESCRITURA, NO HICE FUNCIONES REUTILIZABLES POR QUE SOY FLOJA
// function typeWriterSeparator() {
//     document.getElementById("contain").innerHTML += separator;
//     if (separatorCount === separator.length) {

//     }
// }


function typeWriterContain() {
    if (e < contain.length && i === title.length) {
        document.getElementById("contain").innerHTML += contain.charAt(e);
        e++;
        setTimeout(typeWriterContain, speed);

    }
}


function typeWriterSignature() {
    if (signatureCount < signatureText.length) {
        document.getElementById("signature-text").innerHTML += signatureText.charAt(signatureCount);
        signatureCount++;

        setTimeout(typeWriterSignature, speed);

    }
}

function typeWriterNameText() {
    if (nameCount < nameText.length) {
        document.getElementById("name").innerHTML += nameText.charAt(nameCount);
        nameCount++;
        if (nameCount === nameText.length) {
            typeWriterAliasText()
        }
        setTimeout(typeWriterNameText, speed);

    }
}

function typeWriterAliasText() {
    if (aliasCount < aliasText.length) {
        document.getElementById("alias").innerHTML += aliasText.charAt(aliasCount);
        aliasCount++;
        if (aliasCount === aliasText.length) {
            typeWriterSignature()
        }
        setTimeout(typeWriterAliasText, speed);

    }
}


function showPopup() {
    document.getElementById('popup').style.display = 'block';

    setTimeout(function() {
        document.getElementById('popup').style.display = 'none';
    }, 10000);

    setInterval(showPopup, 50000);
}


function showPopupMackenzie() {
    document.getElementById('popupMackenzie').style.display = 'block';

    setTimeout(function() {
        document.getElementById('popupMackenzie').style.display = 'none';
    }, 10500);

    setInterval(showPopupMackenzie, 60000);
}



function showPopupOrgtx() {
    document.getElementById('popupOrgtx').style.display = 'block';

    setTimeout(function() {
        document.getElementById('popupOrgtx').style.display = 'none';
    }, 10900);

    setInterval(showPopupOrgtx, 70000);
}