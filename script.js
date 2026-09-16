const CATEGORIES = [
  {
    title: "The Hogwarts Students — Gryffindor",
    characters: [
      ["harry-potter", "Harry Potter"],
      ["hermione-granger", "Hermione Granger"],
      ["ron-weasley", "Ron Weasley"],
      ["ginny-weasley", "Ginny Weasley"],
      ["neville-longbottom", "Neville Longbottom"],
      ["fred-weasley", "Fred Weasley"],
      ["george-weasley", "George Weasley"],
      ["oliver-wood", "Oliver Wood"],
      ["percy-weasley", "Percy Weasley"],
      ["lavender-brown", "Lavender Brown"],
      ["seamus-finnigan", "Seamus Finnigan"],
      ["dean-thomas", "Dean Thomas"],
      ["colin-creevey", "Colin Creevey"],
      ["lee-jordan", "Lee Jordan"],
    ],
  },
  {
    title: "The Hogwarts Students — Ravenclaw, Hufflepuff & Slytherin",
    characters: [
      ["parvati-patil", "Parvati Patil"],
      ["padma-patil", "Padma Patil"],
      ["luna-lovegood", "Luna Lovegood"],
      ["cho-chang", "Cho Chang"],
      ["cedric-diggory", "Cedric Diggory"],
      ["draco-malfoy", "Draco Malfoy"],
      ["pansy-parkinson", "Pansy Parkinson"],
      ["blaise-zabini", "Blaise Zabini"],
      ["vincent-crabbe", "Vincent Crabbe"],
      ["gregory-goyle", "Gregory Goyle"],
    ],
  },
  {
    title: "Hogwarts Faculty, Staff & Founders",
    characters: [
      ["albus-dumbledore", "Albus Dumbledore"],
      ["severus-snape", "Severus Snape"],
      ["minerva-mcgonagall", "Minerva McGonagall"],
      ["rubeus-hagrid", "Rubeus Hagrid"],
      ["gilderoy-lockhart", "Gilderoy Lockhart"],
      ["remus-lupin", "Remus Lupin"],
      ["mad-eye-moody", 'Alastor "Mad-Eye" Moody'],
      ["dolores-umbridge", "Dolores Umbridge"],
      ["sybill-trelawney", "Sybill Trelawney"],
      ["filius-flitwick", "Filius Flitwick"],
      ["pomona-sprout", "Pomona Sprout"],
      ["horace-slughorn", "Horace Slughorn"],
      ["argus-filch", "Argus Filch"],
      ["madam-pomfrey", "Madam Pomfrey"],
      ["madam-hooch", "Madam Hooch"],
      ["garrick-ollivander", "Garrick Ollivander"],
    ],
  },
  {
    title: "The Dark Side — Voldemort & Death Eaters",
    characters: [
      ["lord-voldemort", "Lord Voldemort"],
      ["bellatrix-lestrange", "Bellatrix Lestrange"],
      ["lucius-malfoy", "Lucius Malfoy"],
      ["narcissa-malfoy", "Narcissa Malfoy"],
      ["peter-pettigrew", "Peter Pettigrew"],
      ["barty-crouch-jr", "Barty Crouch Jr."],
      ["fenrir-greyback", "Fenrir Greyback"],
      ["quirinus-quirrell", "Quirinus Quirrell"],
    ],
  },
  {
    title: "The Order of the Phoenix & Allies",
    characters: [
      ["sirius-black", "Sirius Black"],
      ["nymphadora-tonks", "Nymphadora Tonks"],
      ["arthur-weasley", "Arthur Weasley"],
      ["molly-weasley", "Molly Weasley"],
      ["bill-weasley", "Bill Weasley"],
      ["fleur-delacour", "Fleur Delacour"],
      ["kingsley-shacklebolt", "Kingsley Shacklebolt"],
      ["aberforth-dumbledore", "Aberforth Dumbledore"],
      ["lily-potter", "Lily Potter"],
      ["james-potter", "James Potter"],
    ],
  },
  {
    title: "Non-Human Characters & Ghosts",
    characters: [
      ["dobby", "Dobby"],
      ["kreacher", "Kreacher"],
      ["nearly-headless-nick", "Nearly Headless Nick"],
      ["moaning-myrtle", "Moaning Myrtle"],
      ["the-fat-lady", "The Fat Lady"],
      ["griphook", "Griphook"],
    ],
  },
];

const ALL_CHARACTERS = CATEGORIES.flatMap((category) => category.characters);
const ALL_CARDS = [];
let grid = null;

function buildBoard() {
  const board = document.getElementById("board");

  grid = document.createElement("div");
  grid.className = "grid";

  ALL_CHARACTERS.forEach(([slug, name]) => {
    const card = buildCard(slug, name);
    ALL_CARDS.push(card);
    grid.appendChild(card);
  });

  board.appendChild(grid);
}

function buildCard(slug, name) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.setAttribute("aria-pressed", "false");
  card.setAttribute("aria-label", `${name} — click to flip`);

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">
        <img class="portrait" src="images/${slug}.svg" alt="${name}" loading="lazy">
        <span class="card-name">${name}</span>
      </div>
      <div class="card-face card-back">
        <span class="card-name-back">${name}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    const flipped = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(flipped));
    updateOpenCount();
  });

  return card;
}

function updateOpenCount() {
  const openCount = ALL_CARDS.filter((card) => !card.classList.contains("flipped")).length;
  document.getElementById("open-counter").textContent =
    `Open Cards: ${openCount} / ${ALL_CARDS.length}`;
}

function resetCards() {
  ALL_CARDS.forEach((card) => {
    card.classList.remove("flipped");
    card.setAttribute("aria-pressed", "false");
  });
  updateOpenCount();
}

function resetCardOrder() {
  ALL_CARDS.forEach((card) => grid.appendChild(card));
}

function reorganizeCards() {
  const open = ALL_CARDS.filter((card) => !card.classList.contains("flipped"));
  const closed = ALL_CARDS.filter((card) => card.classList.contains("flipped"));
  [...open, ...closed].forEach((card) => grid.appendChild(card));
}

function startNewGame() {
  const [slug, name] = ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];

  const reveal = document.getElementById("reveal");
  const revealImg = document.getElementById("reveal-portrait");
  const revealName = document.getElementById("reveal-name");

  revealImg.src = `images/${slug}.svg`;
  revealImg.alt = name;
  revealName.textContent = name;
  reveal.classList.add("active");

  resetCards();
  resetCardOrder();
}

function init() {
  buildBoard();
  document.getElementById("character-count").textContent =
    `${ALL_CHARACTERS.length} characters from the Wizarding World.`;
  updateOpenCount();
  document.getElementById("new-game-btn").addEventListener("click", startNewGame);
  document.getElementById("reorganize-btn").addEventListener("click", reorganizeCards);
}

document.addEventListener("DOMContentLoaded", init);
