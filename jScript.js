document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("videoPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const stopBtn = document.getElementById("stopBtn");
    const muteBtn = document.getElementById("muteBtn");
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const seekBar = document.getElementById("seekBar");
    const controls = document.getElementById("controls");
    const videoContainer = document.querySelector(".video-container");
    const videoList = document.getElementById("videoList");
    const currentTimeSpan = document.getElementById("currentTime");
    const durationSpan = document.getElementById("duration");

    // Carga los videos desde el archivo JSON
    fetch('videos.json')
        .then(response => response.json())
        .then(data => {
            data.videos.forEach(videoData => {
                const li = document.createElement('li');
                li.textContent = videoData.title;
                li.setAttribute('data-video', videoData.src);
                videoList.appendChild(li);
            });

            // Reproduce el primer video al cargar la página
            video.src = data.videos[0].src;

            // Añadir eventos a la lista de videos
            const videoElements = document.querySelectorAll('.video-list li');
            videoElements.forEach(videoElement => {
                videoElement.addEventListener('click', () => {
                    const videoSrc = videoElement.getAttribute('data-video');
                    video.src = videoSrc;
                    video.play();
                    playPauseBtn.textContent = "Pause";
                });
            });
        });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    playPauseBtn.addEventListener("click", function() {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = "Pause";
        } else {
            video.pause();
            playPauseBtn.textContent = "Play";
        }
    });

    stopBtn.addEventListener("click", function() {
        video.pause();
        video.currentTime = 0;
        playPauseBtn.textContent = "Play";
    });

    muteBtn.addEventListener("click", function() {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? "Unmute" : "Mute";
    });

    fullscreenBtn.addEventListener("click", function() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            fullscreenBtn.textContent = "Fullscreen";
        } else {
            videoContainer.requestFullscreen();
            fullscreenBtn.textContent = "Exit Fullscreen";
        }
    });

    video.addEventListener("loadedmetadata", function() {
        durationSpan.textContent = formatTime(video.duration);
    });

    video.addEventListener("timeupdate", function() {
        const value = (100 / video.duration) * video.currentTime;
        seekBar.value = value;
        currentTimeSpan.textContent = formatTime(video.currentTime);
    });

    seekBar.addEventListener("input", function() {
        const time = video.duration * (seekBar.value / 100);
        video.currentTime = time;
    });

    let hideControlsTimeout;

    function showControls() {
        controls.classList.remove("hidden");
        resetHideControlsTimeout();
    }

    function hideControls() {
        controls.classList.add("hidden");
    }

    function resetHideControlsTimeout() {
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(hideControls, 3000);
    }

    function handleFullscreenChange() {
        if (document.fullscreenElement) {
            hideControls(); // Oculta los controles al entrar en pantalla completa
            video.addEventListener("mousemove", showControls);
            video.addEventListener("mouseleave", resetHideControlsTimeout);
        } else {
            showControls(); // Muestra los controles al salir de pantalla completa
            video.removeEventListener("mousemove", showControls);
            resetHideControlsTimeout();
        }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Muestra controles al interactuar con el video o el contenedor
    videoContainer.addEventListener("mousemove", showControls);
    document.addEventListener("keydown", showControls);
    video.addEventListener("mousemove", showControls);
    video.addEventListener("mouseleave", resetHideControlsTimeout);

    resetHideControlsTimeout();
});
