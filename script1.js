// 1. Create the page inside the empty main element.
// Backticks let us write this HTML string on more than one line.
const game = document.getElementById('game');
game.innerHTML = `
    <div class="night" aria-hidden="true">
        <div class="streetlight"></div>
        <div class="skyline"></div>
        <div class="rain"></div>
    </div>
    <header class="topbar">
        <span class="brand">THE WAY HOME<span class="brand-dot">.</span></span>
        <span class="edition">or is it?</span>
    </header>
    <section id="scene-panel" aria-labelledby="scene-title">
        <div class="scene-meta">
            <span id="time"></span>
            <span class="meta-line"></span>
            <span id="location"></span>
        </div>
        <p id="chapter" class="eyebrow"></p>
        <h1 id="scene-title" tabindex="-1"></h1>
        <p id="story"></p>
        <div class="choices">
            <button id="choice-one" type="button">
                <span class="choice-number" aria-hidden="true">01</span>
                <span id="label-one"></span>
                <span class="arrow" aria-hidden="true">↗</span>
            </button>
            <button id="choice-two" type="button">
                <span class="choice-number" aria-hidden="true">02</span>
                <span id="label-two"></span>
                <span class="arrow" aria-hidden="true">↗</span>
            </button>
        </div>
        <p id="thought" aria-live="polite"></p>
    </section>
    <footer>
        <span>HOVER OR FOCUS TO CONSIDER · CLICK TO CHOOSE</span>
        <span id="sound-note">CLICK A CHOICE, DO YOU HEAR SOMETHING?</span>
    </footer>
`;

// 2. Each object holds the text and two choices for one screen.
// nextOne and nextTwo are the array numbers of the next screens.
const scenes = [
    {
        time: '02:17 AM',
        location: 'OUTSIDE THE BAR',
        chapter: 'LAST CALL',
        title: 'The night is over.\nYou’re not home.',
        text: 'You’re Alex, 23. Your friends have already left. The music still rings in your ears, and you’re a little drunk just enough that the sidewalk feels less steady than it should.\n\nYour phone is at 8%. Home is across town. Maya, your sober roommate, said to call if you needed her. You told her you’d be fine.',
        one: 'Call Maya',
        two: 'Head for the station',
        thoughtOne: '“She did say I could call. Even this late.”',
        thoughtTwo: '“I’ve taken this train a hundred times.”',
        nextOne: 1,
        nextTwo: 2,
        theme: 'nighttime'
    },
    {
        time: '02:19 AM',
        location: 'DECISIONS, DECISIONS',
        chapter: 'SOMEONE PICKS UP',
        title: '“Stay somewhere\nI can find you.”',
        text: 'Maya sounds sleepy, but she’s getting her keys. “Twelve minutes. Wait inside the diner by the bar, okay?”\n\nThrough its window, you can see a server wiping the counter. Waiting feels awkward. Maybe you could save Maya some time by meeting her a few blocks away.',
        one: 'Wait inside the diner',
        two: 'Walk to meet her',
        thoughtOne: '“Twelve minutes isn’t actually that long.”',
        thoughtTwo: '“If I keep moving, I’ll feel less tired.”',
        nextOne: 3,
        nextTwo: 4,
        theme: 'nighttime'
    },
    {
        time: '02:22 AM',
        location: 'THE STATION GATE',
        chapter: 'A CHANGE OF PLAN',
        title: 'The gate\nis locked.',
        text: 'A service notice points to another entrance across the avenue. You read it twice. Rain runs down the screen of your phone. 5%.\n\nThe diner is still open behind you. Across the road, the station sign is glowing. It looks close enough to reach in a minute.',
        one: 'Go back to the diner',
        two: 'Try the other entrance',
        thoughtOne: '“There’s light, a phone charger, and someone to ask.”',
        thoughtTwo: '“Just one more block. Then I’m on my way.”',
        nextOne: 3,
        nextTwo: 4,
        theme: 'nighttime'
    },
    {
        time: '02:31 AM',
        location: 'THE 24/7 DINER',
        chapter: 'A PLACE TO PAUSE',
        title: 'A booth. A charger.\nA little time.',
        text: 'You sit down and plug in your phone. The server asks if you need a ride. You message Maya your exact location; she confirms she can pick you up.\n\nFor the first time tonight, you stop trying to rush. You can wait here for her, or ask the server to arrange a licensed taxi.',
        one: 'Wait for Maya',
        two: 'Ask for a taxi',
        thoughtOne: '“I don’t have to figure out the rest alone.”',
        thoughtTwo: '“I can spend a little more to get home tonight.”',
        nextOne: 5,
        nextTwo: 5,
        theme: 'shelter'
    },
    {
        time: '02:26 AM',
        location: 'THE WIDE AVENUE',
        chapter: 'ONE MORE BLOCK',
        title: 'It looks closer\nthan it is.',
        text: 'You reach the avenue. The pedestrian signal says DON’T WALK. Headlights smear across the wet road, and you’re having trouble judging how fast the cars are moving.\n\nThe diner is only a short walk behind you. Ahead, there’s a gap in the traffic. You think you can make it.',
        one: 'Return to the diner',
        two: 'Cross through the gap',
        thoughtOne: '“I can still change my mind.”',
        thoughtTwo: '“It’ll only take a few seconds.”',
        nextOne: 3,
        nextTwo: 6,
        theme: 'danger'
    },
    {
        time: '02:46 AM',
        location: 'HOME SWEET HOME',
        chapter: 'ENDING · HOME SAFE',
        title: 'The best ending\nis an ordinary one.',
        text: '',
        one: 'Start again',
        two: 'Change the last choice',
        thoughtOne: '“Same night. A different route.”',
        thoughtTwo: '“What if I’d chosen the other ride?”',
        nextOne: 0,
        nextTwo: -1,
        theme: 'safe'
    },
    {
        time: 'BEFORE DAWN',
        location: 'NEVER HEARD AGAIN',
        chapter: 'ENDING · NEVER HOME',
        title: 'The message\nstays unread.',
        text: 'You step off the curb. The headlights are much closer than they looked. A driver brakes on the wet road, but there isn’t enough time.\n\nBefore dawn, your family gets a call from the hospital. You died from your injuries. On your phone, one message is still waiting: Maya — “Are you home?”',
        one: 'Start again',
        two: 'Change the last choice',
        thoughtOne: '“Go back to the beginning of the night.”',
        thoughtTwo: '“Go back to the moment at the crossing.”',
        nextOne: 0,
        nextTwo: -1,
        theme: 'tragic'
    }
];

// 3. Select the elements we will update.
const time = document.getElementById('time');
const locationText = document.getElementById('location');
const chapter = document.getElementById('chapter');
const title = document.getElementById('scene-title');
const story = document.getElementById('story');
const thought = document.getElementById('thought');
const choiceOne = document.getElementById('choice-one');
const choiceTwo = document.getElementById('choice-two');
const labelOne = document.getElementById('label-one');
const labelTwo = document.getElementById('label-two');
const soundNote = document.getElementById('sound-note');

// These variables remember where the player is in the story.
let currentScene = 0;
let previousScene = 0;
let safeEnding = '';
const defaultThought = 'Two choices. Take a moment.';
const clickSound = new Audio('choice.wav');
clickSound.volume = 1;

// Rain audio to play between choices
const rainSound = new Audio('rain.wav');
rainSound.loop = true; // Repeat the rain when the recording finishes.
rainSound.volume = 0.12; // Keep the rain quieter than the choice sound.

// 4. Display the current scene, just like updateList() refreshed the grocery list.
const background = document.querySelector('.night');

// Each picture matches a scene in the scenes array.
const sceneImages = [
    'images/1.png', // Outside the bar
    'images/2.png', // Calling Maya
    'images/3.png', // Locked station
    'images/4.png', // Diner
    'images/5.png', // Wide avenue
    'images/6.png', // Safe ending; changes to 7 for the taxi
    'images/8.png'  // Tragic ending
];
function showScene() {
    const scene = scenes[currentScene];
    // Display the picture that matches the current scene.
    background.style.backgroundImage =
    'url("' + sceneImages[currentScene] + '")';
    time.innerText = scene.time;
    locationText.innerText = scene.location;
    chapter.innerText = scene.chapter;
    title.innerText = scene.title;
    story.innerText = scene.text;
    labelOne.innerText = scene.one;
    labelTwo.innerText = scene.two;
    thought.innerText = defaultThought;
    document.body.className = scene.theme;

    if (currentScene === 5) {
        story.innerText = safeEnding;
    }
}

// 5. choice selection sound
function makeChoice(nextScene) {
    // replay the choice sound 
    clickSound.currentTime = 0;
    clickSound.play().catch(function () {
        soundNote.innerText = 'CLICK SOUND UNAVAILABLE · CHECK CHOICE.WAV';
    });

    // rain sound if stopped
    if (rainSound.paused) {
        rainSound.play().catch(function () {
            soundNote.innerText = 'RAIN UNAVAILABLE · CHECK RAIN.WAV';
        });
    }

    if (currentScene < 5) {
        previousScene = currentScene;
    }

    // -1 means to go back
    if (nextScene === -1) {
        currentScene = previousScene;
    } else {
        currentScene = nextScene;
    }

    showScene();
    title.focus();
}

// Clicking chooses a story path. Only the two buttons advance the story.
choiceOne.addEventListener('click', function () {
    if (currentScene === 3) {
        // Use Maya's ride picture when the player waits for her.
        sceneImages[5] = 'images/6.png';
        safeEnding = 'Maya pulls up outside the diner. You ride home with your sober roommate, watching the streetlights pass.\n\nNow your key turns in the lock. Wet shoes by the door. A familiar hallway. Tomorrow, you’ll thank her properly. Tonight, you made it home.';
    }
    makeChoice(scenes[currentScene].nextOne);
});

choiceTwo.addEventListener('click', function () {
    if (currentScene === 3) {
        // Use the taxi picture when the player chooses a taxi.
        sceneImages[5] = 'images/7.png';
        safeEnding = 'The server calls a licensed taxi. Before leaving, you tell Maya the plan has changed and share your trip details. The driver gets you home.\n\nNow your key turns in the lock. Wet shoes by the door. You text Maya: “Home.” There’s nothing dramatic about this ending. That’s the good part.';
    }
    makeChoice(scenes[currentScene].nextTwo);
});

// 6. Hovering changes the inner thought. Keyboard focus does the same thing.
function showThoughtOne() {
    thought.innerText = scenes[currentScene].thoughtOne;
}

function showThoughtTwo() {
    thought.innerText = scenes[currentScene].thoughtTwo;
}

function resetThought() {
    thought.innerText = defaultThought;
}

choiceOne.addEventListener('mouseenter', showThoughtOne);
choiceTwo.addEventListener('mouseenter', showThoughtTwo);
choiceOne.addEventListener('focus', showThoughtOne);
choiceTwo.addEventListener('focus', showThoughtTwo);

const buttons = [choiceOne, choiceTwo];
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('mouseleave', resetThought);
    buttons[i].addEventListener('blur', resetThought);
}

// start the game
showScene();
