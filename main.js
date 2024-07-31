
const video_player = document.querySelector('#video-player'),
    mainVideo = video_player.querySelector('#main-video'),
    progressAreaTime = video_player.querySelector('.progressAreaTime'),
    controls = video_player.querySelector('.controls'),
    progressArea = video_player.querySelector('.progress-area'),
    progressBar = video_player.querySelector('.progress-bar'),
    bufferBar = video_player.querySelector('.buffer-progress-bar'),
    fast_rewind = video_player.querySelector('.fast-rewind'),
    play_pause = video_player.querySelector('.play_pause'),
    fast_forward = video_player.querySelector('.fast-forward'),
    volume_range = video_player.querySelector('.volume_range'),
    volume = video_player.querySelector('.volume'),
    current = video_player.querySelector('.currentTime'),
    totalDuration = video_player.querySelector('.duration'),
    auto_play = video_player.querySelector('.auto-play'),
    settingsBtn = video_player.querySelector('.settingsBtn'),
    captionsBtn = video_player.querySelector('.captionsBtn'),
    picture_in_picture = video_player.querySelector('.picture_in_picture'),
    fullscreen = video_player.querySelector('.fullscreen'),
    settings = video_player.querySelector('#settings'),
    captions = video_player.querySelector('#captions'),
    caption_labels = video_player.querySelector('.captions ul'),
    playback = video_player.querySelectorAll('.playback li'),
    tracks = video_player.querySelectorAll('track');
    change_audio = video_player.querySelector('.change_audio');

    let thumbnail = video_player.querySelector('.thumbnail');

mainVideo.addEventListener('loadeddata', () => {
    setInterval(() => {
        let bufferedTime = mainVideo.buffered.end(0);
        console.log(bufferedTime);
        let duration = mainVideo.duration;
        let width = (bufferedTime / duration) * 100;
        bufferBar.style.width = `${width}%`;
    }, 2000);
})

if (tracks.length != 0) {
    caption_labels.insertAdjacentHTML('afterbegin', `<li data-track="OFF" class="active">OFF</li>`)
    for (var i = 0; i < tracks.length; i++) {
        trackLi = `<li data-track="${tracks[i].label}">${tracks[i].label}</li>`;
        caption_labels.insertAdjacentHTML('beforeend', trackLi);
    }
}

// audio changing


const caption = captions.querySelectorAll('ul li');

// Play video function
function playVideo() {
    play_pause.innerHTML = 'pause';
    play_pause.title = "pause";
    video_player.classList.add('paused');
    mainVideo.play();
}

// Pause video function
function pauseVideo() {
    play_pause.innerHTML = 'play_arrow';
    play_pause.title = "play";
    video_player.classList.remove('paused');
    mainVideo.pause();
}

mainVideo.addEventListener('click', () => {
    const isVideoPaused = video_player.classList.contains('paused');

    isVideoPaused ? pauseVideo() : playVideo();
})

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent default spacebar behavior (scrolling)
        const isVideoPaused = video_player.classList.contains('paused');
        isVideoPaused ? pauseVideo() : playVideo();
    } else if (event.code === 'ArrowLeft') {
        mainVideo.currentTime -= 10; // Fast rewind
    } else if (event.code === 'ArrowRight') {
        mainVideo.currentTime += 10; // Fast forward
    } else if (event.code === 'KeyM') {
        muteVolume(); // Mute/unmute video
    } else if (event.code === 'ArrowUp') {
        changeVolumeLevel(1); // Increase volume
    } else if (event.code === 'ArrowDown') {
        changeVolumeLevel(-1); // Decrease volume
    }
});


function changeVolumeLevel(direction) {
    let newVolume = mainVideo.volume * 100 + direction * 5;
    newVolume = Math.max(0, Math.min(100, newVolume)); // Ensure volume is within 0-100 range

    mainVideo.volume = newVolume / 100;
    volume_range.value = newVolume;

    if (newVolume == 0) {
        volume.innerHTML = 'volume_off';
    } else if (newVolume < 40) {
        volume.innerHTML = 'volume_down';
    } else {
        volume.innerHTML = 'volume_up';
    }
}

play_pause.addEventListener('click', () => {
    const isVideoPaused = video_player.classList.contains('paused');

    isVideoPaused ? pauseVideo() : playVideo();
})

mainVideo.addEventListener('play', () => {
    playVideo();
})

mainVideo.addEventListener('pause', () => {
    pauseVideo();
})

// fast_rewind video function
fast_rewind.addEventListener('click', () => {
    mainVideo.currentTime -= 10;
})

// fast_forward video function
fast_forward.addEventListener('click', () => {
    mainVideo.currentTime += 10;
})

// Load video duration
mainVideo.addEventListener('loadeddata', (e) => {
    let videoDuration = e.target.duration;

    let totalHours = Math.floor(videoDuration / 3600);
    let totalMin = Math.floor((videoDuration % 3600) / 60);
    let totalSec = Math.floor(videoDuration % 60);

    // If seconds are less than 10, add 0 at the beginning
    totalSec = totalSec < 10 ? '0' + totalSec : totalSec;
    // If minutes are less than 10, add 0 at the beginning
    totalMin = totalMin < 10 ? '0' + totalMin : totalMin;
    // If hours are less than 10, add 0 at the beginning
    totalHours = totalHours < 10 ? '0' + totalHours : totalHours;

    totalDuration.innerText = `${totalHours}:${totalMin}:${totalSec}`;
})

// Current video time
mainVideo.addEventListener('timeupdate', (e) => {
    let currentVideoTime = e.target.currentTime;

    let currentHours = Math.floor(currentVideoTime / 3600);
    let currentMin = Math.floor((currentVideoTime % 3600) / 60);
    let currentSec = Math.floor(currentVideoTime % 60);

    // If seconds are less than 10, add 0 at the beginning
    currentSec = currentSec < 10 ? '0' + currentSec : currentSec;
    // If minutes are less than 10, add 0 at the beginning
    currentMin = currentMin < 10 ? '0' + currentMin : currentMin;
    // If hours are less than 10, add 0 at the beginning
    currentHours = currentHours < 10 ? '0' + currentHours : currentHours;

    current.innerText = `${currentHours}:${currentMin}:${currentSec}`;

    let videoDuration = e.target.duration;
    // ProgressBar width changing
    let progressWidth = (currentVideoTime / videoDuration) * 100;
    progressBar.style.width = `${progressWidth}%`;
})


// Update playing video time using progress bar width
progressArea.addEventListener('click', (e) => {
    let currentVideoTime = mainVideo.duration;
    let progressWidthval = progressArea.clientWidth;
    let ClickOffsetX = e.offsetX;

    mainVideo.currentTime = (ClickOffsetX / progressWidthval) * currentVideoTime;
})

// change volume
function changeVolume() {
    mainVideo.volume = volume_range.value / 100;

    if (volume_range.value == 0) {
        volume.innerHTML = 'volume_off';
    } else if (volume_range.value < 40) {
        volume.innerHTML = 'volume_down';
    } else {
        volume.innerHTML = 'volume_up';
    }
}

function muteVolume() {
    if (volume_range.value == 0) {
        volume_range.value = 60;
        mainVideo.volume = 0.6;
        volume.innerHTML = 'volume_up';
    } else {
        volume_range.value = 0;
        mainVideo.volume = 0;
        volume.innerHTML = 'volume_off';
    }
}

volume_range.addEventListener('change', () => {
    changeVolume();
})

volume.addEventListener('click', () => {
    muteVolume();
})

// update progress area time and display block on mouse move
progressArea.addEventListener('mousemove', (e) => {
    let progressWidthval = progressArea.clientWidth;
    let x = e.offsetX;

    progressAreaTime.style.setProperty('--x', `${x}px`);
    progressAreaTime.style.display = 'block';

    if (x >= progressWidthval - 120) {
        x = progressWidthval - 120;
    } else if (x <= 95) {
        x = 95;
    } else {
        x = e.offsetX;
    }

    thumbnail.style.setProperty('--x', `${x}px`);
    thumbnail.style.display = 'block';

    let videoDuration = mainVideo.duration;
    let progressTime = Math.floor((x / progressWidthval) * videoDuration);
    
    let currentHours = Math.floor(progressTime / 3600);
    let currentMin = Math.floor((progressTime % 3600) / 60);
    let currentSec = Math.floor(progressTime % 60);

    // If seconds are less than 10, add 0 at the beginning
    currentSec = currentSec < 10 ? '0' + currentSec : currentSec;
    // If minutes are less than 10, add 0 at the beginning
    currentMin = currentMin < 10 ? '0' + currentMin : currentMin;
    // If hours are less than 10, add 0 at the beginning
    currentHours = currentHours < 10 ? '0' + currentHours : currentHours;

    // Display time in the format HH:MM:SS
    progressAreaTime.innerText = `${currentHours}:${currentMin}:${currentSec}`;
});


progressArea.addEventListener('mouseleave', () => {
    thumbnail.style.display = 'none';
    progressAreaTime.style.display = 'none';
})


// Autoplay
auto_play.addEventListener('click', () => {
    auto_play.classList.toggle('active');
    if (auto_play.classList.contains('active')) {
        auto_play.title = "Autoplay is on";
    } else {
        auto_play.title = "Autoplay is off";
    }
});

mainVideo.addEventListener('ended', () => {
    if (auto_play.classList.contains('active')) {
        playVideo();
    } else {
        play_pause.innerHTML = "replay";
        play_pause.title = "Reply";
    }
})

// Picture in picture
picture_in_picture.addEventListener('click', () => {
    mainVideo.requestPictureInPicture();
})

// Fullscreen
fullscreen.addEventListener('click', () => {
    if (!video_player.classList.contains('openFullScreen')) {
        video_player.classList.add('openFullScreen');
        fullscreen.title = "fullscreen_exit";
        video_player.requestFullscreen();
    } else {
        video_player.classList.remove('openFullScreen');
        fullscreen.title = "fullscreen";
        document.exitFullscreen();
    }
})

mainVideo.addEventListener('dblclick', () => {
    if (!video_player.classList.contains('openFullScreen')) {
        video_player.classList.add('openFullScreen');
        fullscreen.title = "fullscreen_exit";
        video_player.requestFullscreen();
    } else {
        video_player.classList.remove('openFullScreen');
        fullscreen.title = "fullscreen";
        document.exitFullscreen();
    }
})

// open settings
settingsBtn.addEventListener('click', () => {
    settings.classList.toggle('active');
    settingsBtn.classList.toggle('active');

    if (captions.classList.contains('active') || captionsBtn.classList.contains('active')) {
        captions.classList.remove('active');
        captionsBtn.classList.remove('active');
    }
})

// open captions
captionsBtn.addEventListener('click', () => {
    captions.classList.toggle('active');
    captionsBtn.classList.toggle('active');
    if (settings.classList.contains('active') || settingsBtn.classList.contains('active')) {
        settings.classList.remove('active');
        settingsBtn.classList.remove('active');
    }
})

// Playback speed
playback.forEach((event) => {
    event.addEventListener('click', () => {
        removeActiveClasses(playback);
        event.classList.add('active');
        let playbackRate = event.getAttribute('data-speed');
        mainVideo.playbackRate = playbackRate;
    })
})

caption.forEach((event) => {
    event.addEventListener('click', () => {
        removeActiveClasses(caption);
        event.classList.add('active');
        changeCaption(event);
    })
})

function removeActiveClasses(e) {
    e.forEach(event => {
        event.classList.remove('active');
    });
}

// changing Captions
let track = mainVideo.textTracks;
console.log(track);
function changeCaption(label) {
    let trackLable = label.getAttribute('data-track');
    for (let i = 0; i < track.length; i++) {
        track[i].mode = "disabled";
        if (track[i].label == trackLable) {
            track[i].mode = "showing";
        }
    }
}

let caption_text = video_player.querySelector('.captions_text');
for (let i = 0; i < track.length; i++) {
    track[i].addEventListener('cuechange', () => {
        if (track[i].mode == "showing") {
            if (track[i].activeCues[0]) {
                let span = `<span><mark>${track[i].activeCues[0].text}</mark></span>`;
                caption_text.innerHTML = span;
            } else {
                caption_text.innerHTML = "";
            }
        }
    })
}

// Blob url
// let xhr = new XMLHttpRequest();
// const videoSource = mainVideo.querySelector('source');
// xhr.open('GET', `${videoSource.src}`);
// console.log(videoSource.src);
// xhr.responseType = 'arraybuffer';
// xhr.onload = (e) => {
//     let blob = new Blob([xhr.response]);
//     let url = URL.createObjectURL(blob);
//     mainVideo.src = url;
// }
// xhr.send();

// store video duration and path in local storage
// window.addEventListener('unload', () => {
//     let setDuration = localStorage.setItem('duration', `${mainVideo.currentTime}`);
//     let setSrc = localStorage.setItem('src', `${mainVideo.getAttribute('src')}`);
// })

// window.addEventListener('load', () => {
//     let getDuration = localStorage.getItem('duration');
//     let getSrc = localStorage.getItem('src');

//     if (getSrc) {
//         mainVideo.src = getSrc;
//         mainVideo.currentTime = getDuration;
//     }
// })

mainVideo.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Mouse over
video_player.addEventListener('mouseenter', () => {
    controls.classList.add('active');
    if (tracks.length != 0) {
        caption_text.classList.remove('active');
    }
})

video_player.addEventListener('mouseleave', () => {
    if (video_player.classList.contains('paused')) {
        if (settingsBtn.classList.contains('active') || captionsBtn.classList.contains('active')) {
            controls.classList.add('active');
        } else {
            controls.classList.remove('active');
            if (tracks.length != 0) {
                caption_text.classList.add('active');
            }
        }
    } else {
        controls.classList.add('active');
    }
})

if (video_player.classList.contains('paused')) {
    if (settingsBtn.classList.contains('active') || captionsBtn.classList.contains('active')) {
        controls.classList.add('active');
    } else {
        controls.classList.remove('active');
        if (tracks.length != 0) {
            caption_text.classList.add('active');
        }
    }
} else {
    controls.classList.add('active');
}

// mobile touch controls
video_player.addEventListener('touchstart', () => {
    controls.classList.add('active');
    setTimeout(() => {
        controls.classList.remove('active');
        if (tracks.length != 0) {
            caption_text.classList.add('active');
        }
    }, 5000);
})

video_player.addEventListener('touchmove', () => {
    if (video_player.classList.contains('paused')) {
        controls.classList.remove('active');
        if (tracks.length != 0) {
            caption_text.classList.add('active');
        }
    } else {
        controls.classList.add('active');
    }
})

if (tracks.length == 0) {
    caption_labels.remove();
    captionsBtn.remove();
    captionsBtn.parentNode.remove();
}


// Video Preview
var thumbnails = [];

var thumbnailWidth = 200;
var thumbnailHeight = 120;
var horizontalItemCount = 5;
var verticalItemCount = 5;

let preview_video = document.createElement('video');
preview_video.preload = 'metadata';
preview_video.width = "500";
preview_video.height = "300";
preview_video.controls = true;

preview_video.addEventListener('loadeddata', (e) => {
    preview_video.pause();

    var count = 1;

    var id = 1;

    var x = 0, y = 0;
})
