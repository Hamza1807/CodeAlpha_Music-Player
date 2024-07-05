document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = new Audio();
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const volumeControl = document.getElementById('volume-control');
    const trackTitle = document.getElementById('track-title');
    const playlist = document.getElementById('playlist');
    const searchInput = document.getElementById('search');
    const categories = document.getElementById('categories');
    const fileInput = document.getElementById('file-input');

    let currentTrackIndex = 0;
    let tracks = [
        { title: "Track 1", src: "track1.mp3", category: "pop" },
        { title: "Track 2", src: "track2.mp3", category: "rock" },
        { title: "Track 3", src: "track3.mp3", category: "jazz" }
    ];

    function loadTrack(index) {
        audioPlayer.src = tracks[index].src;
        trackTitle.textContent = tracks[index].title;
        audioPlayer.load();
    }

    function playPauseTrack() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
        updatePlaylist(tracks);
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
        updatePlaylist(tracks);
    }

    function updateVolume() {
        audioPlayer.volume = volumeControl.value;
    }

    function updatePlaylist(filteredTracks) {
        playlist.innerHTML = '';
        filteredTracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.dataset.index = index;
            if (index === currentTrackIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', function () {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                audioPlayer.play();
                playPauseButton.textContent = 'Pause';
                updatePlaylist(filteredTracks);
            });
            playlist.appendChild(li);
        });
    }

    function filterTracks(category) {
        if (category === 'all') {
            return tracks;
        }
        return tracks.filter(track => track.category === category);
    }

    function handleFileUpload(event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const track = {
                title: file.name,
                src: URL.createObjectURL(file),
                category: 'uploaded'
            };
            tracks.push(track);
        }
        updatePlaylist(tracks);
    }

    playPauseButton.addEventListener('click', playPauseTrack);
    prevButton.addEventListener('click', prevTrack);
    nextButton.addEventListener('click', nextTrack);
    volumeControl.addEventListener('input', updateVolume);

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTracks = tracks.filter(track => track.title.toLowerCase().includes(searchTerm));
        updatePlaylist(filteredTracks);
    });

    categories.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            const category = e.target.dataset.category;
            const filteredTracks = filterTracks(category);
            updatePlaylist(filteredTracks);
        }
    });

    fileInput.addEventListener('change', handleFileUpload);

    loadTrack(currentTrackIndex);
    updatePlaylist(tracks);
});
