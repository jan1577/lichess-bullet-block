const quotes = [
    '"The greatest glory in living lies not in never falling, but in never playing a bullet game of chess." - Nelson Mandela',
    '"Stay hungry, stay foolish, and most importantly, stay away from bullet chess." - Steve Jobs',
    '"The only way to do great work is to love what you do and not waste time playing bullet chess." - Steve Jobs',
    '"The future belongs to those who believe in the beauty of not playing bullet chess." - Eleanor Roosevelt',
    '"I am not a product of my circumstances. I am a product of not playing bullet chess." - Stephen Hawking',
    '"The only limit to our realization of tomorrow will be our doubts of not playing bullet chess today." - Franklin D. Roosevelt',
    '"The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart, and not through playing bullet chess." - Helen Keller',
    '"The only thing we have to fear is fear itself... and the regret of playing bullet chess." - Franklin D. Roosevelt',
    '"In the end, it\'s not the years in your life that count. It\'s the life in your years, and not the time spent playing bullet chess." - Abraham Lincoln',
    '"The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion against playing bullet chess." - Albert Camus',
    '"I am not a machine. I am not programmed to play bullet every day. I need rest, recovery, and time to think. That\'s why I don\'t play bullet." - Cristiano Ronaldo',
    '"I don\'t play bullet because I want to live like a normal person. I don\'t want to be in the spotlight all the time. I want to be able to enjoy my life and freedom." - Usain Bolt',
    '"I dream my painting and then I play bullet in my dreams. I don\'t need to play bullet in reality." - Vincent van Gogh',
    '"I don\'t play bullet because I believe in quality over quantity. I want to make every move count, not rush through the game." - Serena Williams',
    '"I don\'t play bullet because I believe in the power of strategy and patience. Rushing through a game doesn\'t allow me to fully utilize my skills." - Garry Kasparov',
    '"I don\'t play bullet because I value the process of learning and improving. Rushing through a game doesn\'t give me the opportunity to analyze and grow." - Magnus Carlsen',
    '"I don\'t play bullet because I believe in the importance of mental clarity and focus. Rushing through a game doesn\'t allow me to maintain a clear mind." - Mike Tyson',
    '"I don\'t play bullet because I believe in the beauty of the game. Rushing through it takes away the opportunity to appreciate and savor each move." - Bobby Fischer',
    '"I don\'t play bullet because I believe in the significance of the journey. Rushing through a game doesn\'t allow me to fully experience and enjoy the process." - Simone Biles',
    '"The only thing we have to fear is fear itself... and playing bullet chess. That\'s why I avoid it at all costs." - Franklin D. Roosevelt',
    '"Ask not what your country can do for you, ask what you can do for your country... and definitely don\'t play bullet chess." - John F. Kennedy',
    '"In the end, we will remember not the words of our enemies, but the silence of our friends... and the absence of bullet chess games." - Martin Luther King Jr.',
    '"The only way to deal with a unfree world is to become so absolutely free that your very existence is an act of rebellion... and not playing bullet chess is a part of that freedom." - Albert Camus',
    '"The future doesn\'t belong to the fainthearted; it belongs to the brave... and those who resist the temptation of bullet chess." - Ronald Reagan"',
    '"Change will not come if we wait for some other person or some other time. We are the ones we\'ve been waiting for. We are the change that we seek... and we are the ones who can resist the urge to play bullet chess." - Barack Obama',
    '"The greatest glory in living lies not in never falling, but in rising every time we fall... and in not falling for the allure of bullet chess." - Nelson Mandela',
    '"The only real prison is fear, and the only real freedom is freedom from fear... and from bullet chess." - Aung San Suu Kyi"',
    '"The best way to find yourself is to lose yourself in the service of others... and to lose the temptation to play bullet chess." - Mahatma Gandhi',
    '"We must accept finite disappointment, but never lose infinite hope... and never lose the focus required to avoid bullet chess." - Martin Luther King Jr.',
    '"May the Force be with you, and may you resist the temptation to play a bullet game of chess." - Star Wars"',
    '"Life is not the amount of breaths you take, it\'s the moments that take your breath away, and not the moments spent playing bullet chess." - Hitch',
    '"You can\'t handle the truth... that playing bullet chess won\'t lead you to success." - A Few Good Men',
    '"To infinity and beyond, but not to the realm of bullet chess." - Toy Story',
    '"I\'ll be back... after I\'ve resisted the urge to play a bullet game of chess." - The Terminator',
    '"The first rule of Fight Club is: You do not talk about Fight Club, and you do not play bullet chess." - Fight Club',
    '"You had me at hello, but you lost me at bullet chess." - Jerry Maguire',
    '"Here\'s looking at you, kid, and hoping you\'re not looking at a chess bullet game." - Casablanca',
    '"I feel the need—the need for speed, and the need to avoid bullet chess." - Top Gun',
    '"Carpe diem. Seize the day, boys. Make your lives extraordinary, and don\'t waste time on bullet chess." - Dead Poets Society'
]


function insertQuote() {
    let div = document.createElement('div');
    div.id = 'quote';

    let p = document.createElement('p');
    p.id = 'quote-text';
    p.style.cssText = "text-align: center; margin: 0; font-style: italic; opacity: 0.85;";
    p.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];
    div.appendChild(p);

    const mainWrap = document.getElementById('main-wrap');

    if (mainWrap && mainWrap.parentNode) {
        // Steal #main-wrap's margin-top (which clears the fixed header) so
        // our div gets that spacing instead. Then zero out #main-wrap's own
        // margin-top so it sits directly below the quote. This works
        // consistently in both Chrome and Firefox.
        const mainWrapMarginTop = getComputedStyle(mainWrap).marginTop;

        div.style.cssText = [
            "width: 100%",
            "box-sizing: border-box",
            "text-align: center",
            "padding: 8px 16px",
            "margin-top: " + mainWrapMarginTop,
            "background: transparent",
            "color: #d59120",
        ].join("; ") + ";";

        mainWrap.parentNode.insertBefore(div, mainWrap);
        mainWrap.style.marginTop = "0";
    } else {
        console.log('LichessBulletBlock: #main-wrap not found, using fallback.');
        div.style.cssText = "width: 100%; box-sizing: border-box; text-align: center; padding: 8px 16px;";
        const topBar = document.getElementById('top');
        if (topBar && topBar.parentNode) {
            topBar.parentNode.insertBefore(div, topBar.nextSibling);
        }
    }
}

StorageService.get(['enable_quotes']).then(function (result) {
    if (!result['enable_quotes']) {
        return;
    } else {
        insertQuote();
    }
}).catch((error) => {
    console.error('LichessBulletBlock: Failed to load quotes setting.', error);
});






