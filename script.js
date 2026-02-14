document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const passcodeOverlay = document.getElementById('passcode-overlay');
    const quizOverlay = document.getElementById('quiz-overlay');
    const mainContent = document.getElementById('main-content');
    const passcodeDots = document.querySelectorAll('.passcode-dots span');
    const keys = document.querySelectorAll('.key[data-key]');
    const deleteBtn = document.getElementById('delete-btn');
    const errorMsg = document.getElementById('error-msg');

    const quizStep = document.getElementById('quiz-step');
    const quizError = document.getElementById('quiz-error');

    const uptimeDisplay = document.getElementById('uptime-display');
    const lyricsTrack = document.getElementById('lyrics-track');
    const bgMusic = document.getElementById('bg-music');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const volumeSlider = document.getElementById('volume-slider');

    const timeline = document.getElementById('timeline');
    const heartContainer = document.getElementById('heart-container');

    // --- State ---
    const CORRECT_PASSCODE = '080702';
    let inputPasscode = '';
    let currentQuizStep = 0;
    let isMuted = false;

    const startDate = new Date('2024-09-08T00:00:00'); // Relationship start date

    const quizData = [
        {
            question: "1. วันครบรอบของเราที่เราตกลงกันคือวันที่เท่าไหร่",
            options: ["08/07/20", "08/09/24", "02/11/06", "08/07/02"],
            correct: 1
        },
        {
            question: "2. เค้าชอบกินอะไรที่สุด",
            options: [
                "ข้าวหมูทอดเนื้อแดดเดียว",
                "ต้มยำกุ้ง",
                "โกเด้ง",
                "ข้าวกระเพรา .... ไม่พริก ไข่ดาวไม่สุก"
            ],
            correct: 3
        },
        {
            question: "3. คิดว่าทุกวันนี้เรามีความสุขที่มีกันรึป่าว",
            options: ["มีสิมากๆด้วย", "ไม่มีเลย"],
            correct: 0
        }
    ];

    const lyricsData = `
Loving can hurt, loving can hurt sometimes
But it's the only thing that I know
When it gets hard, you know it can get hard sometimes
It is the only thing makes us feel alive
We keep this love in a photograph
We made these memories for ourselves
Where our eyes are never closing
Hearts are never broken
And time's forever frozen still
So you can keep me
Inside the pocket of your ripped jeans
Holding me closer 'til our eyes meet
You won't ever be alone, wait for me to come home
Loving can heal, loving can mend your soul
And it's the only thing that I know, know
I swear it will get easier
Remember that with every piece of ya
Hmm, and it's the only thing we take with us when we die
Hmm, we keep this love in this photograph
We made these memories for ourselves
Where our eyes are never closing
Hearts were never broken
And time's forever frozen, still
So you can keep me
Inside the pocket of your ripped jeans
Holding me closer 'til our eyes meet
You won't ever be alone
And if you hurt me
That's okay, baby, only words bleed
Inside these pages, you just hold me
And I won't ever let you go
Wait for me to come home
Wait for me to come home
Wait for me to come home
Wait for me to come home
Oh, you can fit me
Inside the necklace you got when you were sixteen
Next to your heartbeat where I should be
Keep it deep within your soul
And if you hurt me
Well, that's okay, baby, only words bleed
Inside these pages, you just hold me
And I won't ever let you go
When I'm away, I will remember how you kissed me
Under the lamppost back on Sixth street
Hearing you whisper through the phone
Wait for me to come home`.trim().split('\n');

    const timelineMoments = [
        { date: "Moment 1", text: "วันนั้นเราไปเมืองเก่าสงขลากันและร้อนมากแต่ก็มีความสุขมากๆเลยด้วยเพราะมีเธอไปด้วยทุกที่รักนะ", img: "LINE_ALBUM_mababevbvb_260214_1.jpg", side: "left" },
        { date: "Moment 2", text: "รูปนี้เหมือนจะเป็นช่วงที่เค้าฝึกขับรถแรกๆ 5555+ จากคนที่ไม่กล้าทำอะไร จนเธอทำให้เค้ากล้าจนถึงทุกวันนี้ ขอบคุณนะ", img: "LINE_ALBUM_mababevbvb_260214_2.jpg", side: "right" },
        { date: "Moment 3", text: "ส่วนรูปนี้เป็นเคาท์ดาวน์ปีแรกของเราที่สงขลาเค้ามีความสุขมาก เพราะเค้าเคยเคาท์ดาวน์กับแฟนครั้งแรกและมีความสุขมากจริงๆจนถึงทุกวันนี้เธอก็ยังตามใจเค้าไม่เปลี่ยนเลย", img: "LINE_ALBUM_mababevbvb_260214_3.jpg", side: "left" },
        { date: "Moment 4", text: "รักที่เป็นหัวใจของกันและกัน", img: "LINE_ALBUM_mababevbvb_260214_4.jpg", side: "right" },
        { date: "Moment 5", text: "ส่วนรูปนี้ก็คือรูปที่เราดูหนังเรื่องวัยเป้งกัน เรื่องแรกก็นักเลงเลยอะไม่ใช่นักรักหรืออะไร5555 แต่ก็รักเธอมากนะ", img: "LINE_ALBUM_mababevbvb_260214_5.jpg", side: "left" },
        { date: "Moment 6", text: "รูปนี้ถ้าจำไม่ผิดเราคงไปอีเกียกันและไปดูของให้แม่เธอก็ยังทำเพื่อเค้าตั้งแต่เจอกันครั้งแรกๆ", img: "LINE_ALBUM_mababevbvb_260214_6.jpg", side: "right" },
        { date: "Moment 7", text: "รูปนี้คือรูปที่เค้าไปนอนบ้านเธอครั้งแรกเค้ามีความสุขมากๆและรักเธอมากๆเลย เค้าคิดถึงเธอมากจนต้องนั่งรถออกไปหาแต่ว่าคือเจอกันครั้งแรกแต่เค้าก็เริ่มคิดถึงเธอแล้ว", img: "LINE_ALBUM_mababevbvb_260214_7.jpg", side: "left" },
        { date: "Moment 8", text: "รูปนี้คงจะเป็นช่วงที่เราเจอกันแรกๆถ่ายในรถถึงจะเจอกันครั้งแรกเค้าก็เริ่มเปลี่ยนและรู้สึกว่าเค้าอยากทำให้ผู้หญิงคนนี้มีความสุขจริงๆนะ", img: "LINE_ALBUM_mababevbvb_260214_8.jpg", side: "right" },
        { date: "Moment 9", text: "ส่วนรูปนี้แฟนแฟนซุบไหล่เค้าน่ารักมากอาหมวยสุดสุด", img: "LINE_ALBUM_mababevbvb_260214_9.jpg", side: "left" },
        { date: "Moment 10", text: "และรูปนี้เราไปกินชาบูชิกันที่อีเกียเป็นครั้งแรกที่ทำให้เค้ารู้และเริ่มจำว่าเธอชอบกุ้งแก้วมั้กมั้ก", img: "LINE_ALBUM_mababevbvb_260214_10.jpg", side: "right" },
        { date: "Moment 11", text: "ตลอดไปและตลอดกาล", img: "LINE_ALBUM_mababevbvb_260214_11.jpg", side: "left" }
    ];

    // --- Initialization ---
    // Inject Lyrics (Repeatedly for continuous scroll)
    for (let i = 0; i < 5; i++) {
        lyricsData.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            lyricsTrack.appendChild(p);
        });
    }

    // Inject Timeline
    timelineMoments.forEach((m, i) => {
        const div = document.createElement('div');
        div.className = `moment ${m.side} anim-slide-${m.side} ${m.isHeart ? 'heart-moment' : ''}`;
        div.innerHTML = `
            <div class="moment-date">${m.date}</div>
            <div class="moment-img-container ${m.isHeart ? 'heart-frame' : ''}">
                <img src="${m.img}" alt="Moments">
            </div>
            <div class="moment-text">${m.text}</div>
        `;
        timeline.appendChild(div);
    });

    let musicStarted = false;

    function startMusic() {
        if (!musicStarted) {
            bgMusic.play().catch(() => console.log("Music blocked"));
            musicStarted = true;
            soundIcon.textContent = '🔊';
        }
    }
    window.startMusic = startMusic; // Make it global for any remaining onclicks if needed, or better use listeners

    // --- Volume Control ---
    bgMusic.volume = 0.5; // Set initial volume to match slider
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
        isMuted = false; // Unmute if slider is moved
        soundIcon.textContent = '🔊';
    });

    // --- Passcode Flow ---
    function updateDots() {
        passcodeDots.forEach((dot, index) => {
            dot.classList.toggle('filled', index < inputPasscode.length);
        });
    }

    keys.forEach(key => {
        key.addEventListener('click', () => {
            startMusic(); // Trigger music on first interaction
            if (inputPasscode.length < 6) {
                inputPasscode += key.dataset.key;
                updateDots();
                if (inputPasscode.length === 6) setTimeout(checkPasscode, 300);
            }
        });
    });

    deleteBtn.onclick = () => { inputPasscode = inputPasscode.slice(0, -1); updateDots(); };

    function checkPasscode() {
        if (inputPasscode === CORRECT_PASSCODE) {
            passcodeOverlay.classList.add('fade-out');
            setTimeout(() => {
                passcodeOverlay.classList.add('hidden');
                quizOverlay.classList.remove('hidden');
                loadQuiz();
            }, 1000);
        } else {
            errorMsg.classList.remove('hidden');
            inputPasscode = ''; updateDots();
            setTimeout(() => errorMsg.classList.add('hidden'), 1000);
        }
    }

    // --- Quiz Flow ---
    function loadQuiz() {
        const data = quizData[currentQuizStep];
        quizStep.innerHTML = `
            <h3>${data.question}</h3>
            <div class="quiz-options">
                ${data.options.map((opt, i) => `<button class="option-btn" data-index="${i}">${opt}</button>`).join('')}
            </div>
        `;

        // Add listeners to new buttons
        quizStep.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                startMusic();
                selectOption(parseInt(e.target.dataset.index));
            });
        });
    }

    function selectOption(index) {
        if (index === quizData[currentQuizStep].correct) {
            currentQuizStep++;
            if (currentQuizStep < quizData.length) {
                loadQuiz();
            } else {
                unlockFinal();
            }
        } else {
            showErrorPopUp();
            currentQuizStep = 0; // Reset to start
            loadQuiz();
        }
    }

    function showErrorPopUp() {
        const popUp = document.createElement('div');
        popUp.className = 'error-popup';
        popUp.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">❌</div>
                <h2>ตอบผิดง่ะ</h2>
                <p>ลองใหม่นะเบ้บ</p>
                <button class="popup-close">โอเคคค</button>
            </div>
        `;
        document.body.appendChild(popUp);

        const closeBtn = popUp.querySelector('.popup-close');
        closeBtn.onclick = () => {
            popUp.classList.add('fade-out');
            setTimeout(() => popUp.remove(), 500);
        };
    }

    function unlockFinal() {
        quizOverlay.classList.add('fade-out');
        setTimeout(() => {
            quizOverlay.classList.add('hidden');
            document.body.classList.remove('locked');
            mainContent.classList.remove('hidden-content');
            mainContent.style.display = 'block'; // Ensure visible
            setTimeout(() => mainContent.classList.add('show-content'), 100);

            startMusic();
            startUptime();
            startScrollObserver();
            setInterval(createHeart, 2000);
        }, 1000);
    }

    // --- Uptime Counter ---
    function startUptime() {
        setInterval(() => {
            const now = new Date();
            const diff = now - startDate;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            uptimeDisplay.textContent = `${days}d : ${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
        }, 1000);
    }

    // --- Scroll Observer ---
    function startScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.anim-fade, .anim-slide-up, .anim-slide-left, .anim-slide-right').forEach(el => {
            observer.observe(el);
        });
    }

    // --- Helpers ---
    soundToggle.onclick = () => {
        isMuted = !isMuted;
        isMuted ? bgMusic.pause() : bgMusic.play();
        soundIcon.textContent = isMuted ? '🔈' : '🔊';
    };

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.fontSize = `${15 + Math.random() * 20}px`;
        heart.style.animationDuration = `${5 + Math.random() * 5}s`;
        heartContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }

    // --- Star Background ---
    function createStars() {
        const starCount = 200;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2 + 1; // 1px to 3px
            const duration = Math.random() * 3 + 2; // 2s to 5s

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;

            document.body.appendChild(star);
        }
    }
    createStars();
});
