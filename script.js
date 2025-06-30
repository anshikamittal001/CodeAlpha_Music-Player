class EnhancedMusicPlayer {
            constructor() {
                this.audio = document.getElementById('audio');
                this.playBtn = document.getElementById('playBtn');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.progressBar = document.getElementById('progressBar');
                this.progress = document.getElementById('progress');
                this.currentTimeEl = document.getElementById('currentTime');
                this.durationEl = document.getElementById('duration');
                this.volumeSlider = document.getElementById('volumeSlider');
                this.musicPlayer = document.getElementById('musicPlayer');
                
                this.isPlaying = false;
                this.currentTrack = 0;
                this.isDragging = false;
                
                this.tracks = [
                    {
        src: "Song/1.m4a",
        title: "Jaane Ja",
        artist: "TJ Chahal",
        coverpath: "Music_Covers/1.jpg",
        bgpath: "Music_Covers/1.jpg"
    },
    {
        src: "Song/2.m4a",
        title: "Humdum",
        artist: "Aditya Rikhari",
        coverpath: "Music_Covers/2.jpg",
        bgpath: "Music_Covers/2.jpg"
    },
    {
        src: "Song/3.m4a",
        title: "Safar",
        artist: "Juss, Mixsingh",
        coverpath: "Music_Covers/3.jpg",
        bgpath: "Music_Covers/3.jpg"
    },
    {
        src: "Song/4.m4a",
        title: "Janiye",
        artist: "Vishal Mishra",
        coverpath: "Music_Covers/4.jpg",
        bgpath: "Music_Covers/4.jpg"
    },
    {
        src: "Song/5.m4a",
        title: "Qatal",
        artist: "Guru Randhawa, Sanjoy, Gill Machhrai",
        coverpath: "Music_Covers/5.jpg",
        bgpath: "Music_Covers/5.jpg"
    },
    {
        src: "Song/6.m4a",
        title: "Hass Hass",
        artist: "Diljit Dosanjh, Sia, Greg Kurstin",
        coverpath: "Music_Covers/6.jpg",
        bgpath: "Music_Covers/6.jpg"
    },
    {
        src: "Song/7.m4a",
        title: "Till The End",
        artist: "King, NEXA Music",
        coverpath: "Music_Covers/7.jpg",
        bgpath: "Music_Covers/7.jpg"
    },
    {
        src: "Song/8.m4a",
        title: "Haseen",
        artist: "Talwlinder, NDS, Rippy Grewal",
        coverpath: "Music_Covers/8.jpg",
        bgpath: "Music_Covers/8.jpg"
    },
    {
        src: "Song/9.m4a",
        title: "Nasha",
        artist: "Vision & talwlinder",
        coverpath: "Music_Covers/9.jpg",
        bgpath: "Music_Covers/9.jpg"
    },
    {
        src: "Song/10.m4a",
        title: "Samjho Na",
        artist: "Aditya Rikhari",
        coverpath: "Music_Covers/10.jpg",
        bgpath: "Music_Covers/10.jpg"
    },
    {
        src: "Song/11.m4a",
        title: "Mi Amor",
        artist: "Sharn, THE Paul",
        coverpath: "Music_Covers/11.jpg",
        bgpath: "Music_Covers/11.jpg"
    },
    {
        src: "Song/12.m4a",
        title: "Jhol",
        artist: "Maanu, Annural Khalid",
        coverpath: "Music_Covers/12.jpg",
        bgpath: "Music_Covers/12.jpg"
    },
    {
        src: "Song/13.m4a",
        title: "Talwinder",
        artist: "Raiyan, Twinkle Thareja",
        coverpath: "Music_Covers/13.jpg",
        bgpath: "Music_Covers/13.jpg"
    },
    {
        src: "Song/14.m4a",
        title: "Wishes",
        artist: "Hasan Raheem, Umair, Talwlinder",
        coverpath: "Music_Covers/14.jpg",
        bgpath: "Music_Covers/14.jpg"
    },
    {
        src: "Song/15.m4a",
        title: "Nasamajh",
        artist: "Aditya Rikhari",
        coverpath: "Music_Covers/15.jpg",
        bgpath: "Music_Covers/15.jpg"
    }
                ];
                
                this.init();
            }
            
            init() {
                this.loadTrack(this.currentTrack);
                this.bindEvents();
                this.audio.volume = 0.75;
                this.updateVolumeIcon();
            }
            
            bindEvents() {
                // Basic controls
                this.playBtn.addEventListener('click', () => this.togglePlay());
                this.prevBtn.addEventListener('click', () => this.prevTrack());
                this.nextBtn.addEventListener('click', () => this.nextTrack());
                
                // Progress bar - mouse events
                this.progressBar.addEventListener('click', (e) => this.setProgress(e));
                this.progressBar.addEventListener('mousedown', () => this.isDragging = true);
                this.progressBar.addEventListener('mouseup', () => this.isDragging = false);
                
                // Progress bar - touch events
                this.progressBar.addEventListener('touchstart', (e) => {
                    this.isDragging = true;
                    this.setProgress(e.touches[0]);
                });
                this.progressBar.addEventListener('touchmove', (e) => {
                    if (this.isDragging) {
                        e.preventDefault();
                        this.setProgress(e.touches[0]);
                    }
                });
                this.progressBar.addEventListener('touchend', () => this.isDragging = false);
                
                // Volume control
                this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));
                
                // Audio events
                this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
                this.audio.addEventListener('timeupdate', () => this.updateProgress());
                this.audio.addEventListener('ended', () => this.nextTrack());
                
                // Keyboard controls
                document.addEventListener('keydown', (e) => this.handleKeyboard(e));
                
                // Playlist modal controls
                this.playlistBtn = document.getElementById('playlistBtn');
                this.playlistModalOverlay = document.getElementById('playlistModalOverlay');
                this.playlistModal = document.getElementById('playlistModal');
                this.closePlaylist = document.getElementById('closePlaylist');

                this.playlistBtn.addEventListener('click', () => this.showPlaylist());
                this.closePlaylist.addEventListener('click', () => this.hidePlaylist());
                
                // Close modal when clicking overlay
                this.playlistModalOverlay.addEventListener('click', (e) => {
                    if (e.target === this.playlistModalOverlay) {
                        this.hidePlaylist();
                    }
                });
                
                // Prevent modal from closing when clicking inside
                this.playlistModal.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                
                // Handle orientation change
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => this.handleOrientationChange(), 100);
                });
                
                // Handle resize
                window.addEventListener('resize', () => this.handleResize());
            }
            
            loadTrack(index) {
                const track = this.tracks[index];
                this.audio.src = track.src;
                document.querySelector('.track-title').textContent = track.title;
                document.querySelector('.track-artist').textContent = track.artist;
                // Show song image in music player
                const albumArt = document.querySelector('.album-art');
                if (albumArt && track.coverpath) {
                    albumArt.innerHTML = `<img src="${track.coverpath}" alt="Cover" style="width:100%;height:100%;object-fit:cover;border-radius:15px;">`;
                }
                // Update playlist if it's open
                if (this.playlistModalOverlay && this.playlistModalOverlay.classList.contains('active')) {
                    this.renderPlaylist();
                }
                // Add loading animation
                this.musicPlayer.style.opacity = '0.7';
                setTimeout(() => {
                    this.musicPlayer.style.opacity = '1';
                }, 300);
            }
            
            togglePlay() {
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            }
            
            play() {
                this.audio.play().catch(e => console.log('Play failed:', e));
                this.isPlaying = true;
                this.playBtn.innerHTML = '⏸';
                this.playBtn.setAttribute('aria-label', 'Pause');
                this.musicPlayer.classList.add('playing');
                this.musicPlayer.classList.remove('paused');
            }
            
            pause() {
                this.audio.pause();
                this.isPlaying = false;
                this.playBtn.innerHTML = '▶';
                this.playBtn.setAttribute('aria-label', 'Play');
                this.musicPlayer.classList.remove('playing');
                this.musicPlayer.classList.add('paused');
            }
            
            prevTrack() {
                this.currentTrack = this.currentTrack > 0 ? this.currentTrack - 1 : this.tracks.length - 1;
                this.loadTrack(this.currentTrack);
                if (this.isPlaying) {
                    setTimeout(() => this.play(), 300);
                }
            }
            
            nextTrack() {
                this.currentTrack = this.currentTrack < this.tracks.length - 1 ? this.currentTrack + 1 : 0;
                this.loadTrack(this.currentTrack);
                if (this.isPlaying) {
                    setTimeout(() => this.play(), 300);
                }
            }
            
            setProgress(e) {
                const rect = this.progressBar.getBoundingClientRect();
                const clickX = (e.clientX || e.pageX) - rect.left;
                const width = rect.width;
                const duration = this.audio.duration;
                
                if (duration && width > 0) {
                    this.audio.currentTime = (clickX / width) * duration;
                }
            }
            
            updateProgress() {
                if (!this.isDragging) {
                    const { duration, currentTime } = this.audio;
                    if (duration) {
                        const progressPercent = (currentTime / duration) * 100;
                        this.progress.style.width = `${progressPercent}%`;
                        this.progressBar.setAttribute('aria-valuenow', Math.round(progressPercent));
                    }
                    this.currentTimeEl.textContent = this.formatTime(currentTime);
                }
            }
            
            updateDuration() {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
                this.progressBar.setAttribute('aria-valuemax', '100');
                this.progressBar.setAttribute('aria-valuemin', '0');
            }
            
            setVolume(e) {
                const volume = e.target.value / 100;
                this.audio.volume = volume;
                this.updateVolumeIcon();
            }
            
            updateVolumeIcon() {
                const volumeIcon = document.querySelector('.volume-icon');
                const volume = this.audio.volume;
                
                if (volume === 0) {
                    volumeIcon.textContent = '🔇';
                } else if (volume < 0.5) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }
            
            handleKeyboard(e) {
                // Don't interfere if user is typing in an input or modal is open
                if (e.target.tagName === 'INPUT' || this.playlistModalOverlay.classList.contains('active')) return;
                
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        this.togglePlay();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prevTrack();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextTrack();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.volumeSlider.value = Math.min(100, parseInt(this.volumeSlider.value) + 10);
                        this.setVolume({ target: this.volumeSlider });
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.volumeSlider.value = Math.max(0, parseInt(this.volumeSlider.value) - 10);
                        this.setVolume({ target: this.volumeSlider });
                        break;
                    case 'KeyP':
                        e.preventDefault();
                        this.showPlaylist();
                        break;
                    case 'Escape':
                        if (this.playlistModalOverlay.classList.contains('active')) {
                            this.hidePlaylist();
                        }
                        break;
                }
            }

            showPlaylist() {
                this.renderPlaylist();
                this.playlistModalOverlay.classList.add('active');
                this.playlistBtn.setAttribute('aria-expanded', 'true');
                
                // Focus management
                setTimeout(() => {
                    this.closePlaylist.focus();
                }, 300);
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            }

            hidePlaylist() {
                this.playlistModalOverlay.classList.remove('active');
                this.playlistBtn.setAttribute('aria-expanded', 'false');
                
                // Restore body scroll
                document.body.style.overflow = '';
                
                // Return focus to playlist button
                this.playlistBtn.focus();
            }

            renderPlaylist() {
                const playlistTracks = document.getElementById('playlistTracks');
                playlistTracks.innerHTML = '';
                this.tracks.forEach((track, index) => {
                    const trackElement = document.createElement('div');
                    trackElement.className = `playlist-track ${index === this.currentTrack ? 'active' : ''}`;
                    trackElement.setAttribute('role', 'listitem');
                    trackElement.setAttribute('tabindex', '0');
                    trackElement.innerHTML = `
                        <img src="${track.coverpath}" alt="${track.title}" class="track-image" style="width:40px;height:40px;object-fit:cover;border-radius:8px;margin-right:12px;">
                        <div class="track-details">
                            <div class="track-name">${track.title}</div>
                            <div class="track-artist-name">${track.artist}</div>
                        </div>
                        <div class="track-duration">${track.duration ? track.duration : ''}</div>
                    `;
                    // Click/tap event
                    trackElement.addEventListener('click', () => {
                        this.currentTrack = index;
                        this.loadTrack(index);
                        this.play(); // Always play on click
                        this.renderPlaylist();
                        // Auto close playlist after selection on mobile
                        if (window.innerWidth <= 768) {
                            setTimeout(() => this.hidePlaylist(), 1000);
                        }
                    });
                    // Keyboard event
                    trackElement.addEventListener('keydown', (e) => {
                        if (e.code === 'Enter' || e.code === 'Space') {
                            e.preventDefault();
                            this.currentTrack = index;
                            this.loadTrack(index);
                            this.play(); // Always play on keyboard select
                            this.renderPlaylist();
                            if (window.innerWidth <= 768) {
                                setTimeout(() => this.hidePlaylist(), 1000);
                            }
                        }
                    });
                    playlistTracks.appendChild(trackElement);
                    // If duration not loaded, fetch it
                    if (!track.duration) {
                        const audio = document.createElement('audio');
                        audio.src = track.src;
                        audio.preload = 'metadata';
                        audio.addEventListener('loadedmetadata', () => {
                            const dur = isNaN(audio.duration) ? '' : this.formatTime(audio.duration);
                            track.duration = dur;
                            trackElement.querySelector('.track-duration').textContent = dur;
                        });
                    }
                });
            }

            selectTrack(index) {
                this.currentTrack = index;
                this.loadTrack(this.currentTrack);
                this.renderPlaylist();
                if (this.isPlaying) {
                    setTimeout(() => this.play(), 300);
                }
                
                // Auto close playlist after selection on mobile
                if (window.innerWidth <= 768) {
                    setTimeout(() => this.hidePlaylist(), 1000);
                }
            }
            
            handleOrientationChange() {
                // Force a repaint to handle orientation changes
                this.musicPlayer.style.opacity = '0.99';
                setTimeout(() => {
                    this.musicPlayer.style.opacity = '1';
                }, 50);
            }
            
            handleResize() {
                // Handle any resize-specific logic
                if (this.playlistModalOverlay.classList.contains('active')) {
                    this.renderPlaylist();
                }
            }
            
            formatTime(time) {
                if (isNaN(time)) return '0:00';
                
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            new EnhancedMusicPlayer();
        });