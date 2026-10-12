/* =========================================================
   CURIOSO — FINAL CULTURE MAP JS
   State Cards + Search + Filters + SVG Map
   Cultural Passport + XP + Progress
   ========================================================= */


/* =========================================================
   STATE DATA
   ========================================================= */

const states = [

  {name:'Andhra Pradesh',region:'South',emoji:'🌊',festival:'Ugadi',art:'Kalamkari',dance:'Kuchipudi',heritage:'Tirupati Temple'},

  {name:'Arunachal Pradesh',region:'North East',emoji:'🏔️',festival:'Losar',art:'Wood Carving',dance:'Ponung',heritage:'Tawang Monastery'},

  {name:'Assam',region:'North East',emoji:'🌿',festival:'Bihu',art:'Muga Silk',dance:'Bihu Dance',heritage:'Rang Ghar'},

  {name:'Bihar',region:'East',emoji:'🎨',festival:'Chhath Puja',art:'Madhubani Painting',dance:'Jat-Jatin',heritage:'Nalanda'},

  {name:'Chhattisgarh',region:'Central',emoji:'🌳',festival:'Bastar Dussehra',art:'Bell Metal Craft',dance:'Panthi',heritage:'Chitrakote Falls'},

  {name:'Goa',region:'West',emoji:'🌴',festival:'Goa Carnival',art:'Coconut Craft',dance:'Fugdi',heritage:'Basilica of Bom Jesus'},

  {name:'Gujarat',region:'West',emoji:'🪔',festival:'Navratri',art:'Patola',dance:'Garba',heritage:'Rani ki Vav'},

  {name:'Haryana',region:'North',emoji:'🐂',festival:'Teej',art:'Phulkari',dance:'Dhamal',heritage:'Rakhigarhi'},

  {name:'Himachal Pradesh',region:'North',emoji:'🏔️',festival:'Kullu Dussehra',art:'Chamba Rumal',dance:'Nati',heritage:'Shimla Heritage'},

  {name:'Jharkhand',region:'East',emoji:'🌲',festival:'Sarhul',art:'Sohrai Painting',dance:'Chhau',heritage:'Jagannath Temple, Ranchi'},

  {name:'Karnataka',region:'South',emoji:'🛕',festival:'Mysore Dasara',art:'Mysore Silk',dance:'Yakshagana',heritage:'Hampi'},

  {name:'Kerala',region:'South',emoji:'🌴',festival:'Onam',art:'Coir Craft',dance:'Kathakali',heritage:'Padmanabhaswamy Temple'},

  {name:'Madhya Pradesh',region:'Central',emoji:'🐅',festival:'Khajuraho Dance Festival',art:'Gond Painting',dance:'Matki',heritage:'Khajuraho Temples'},

  {name:'Maharashtra',region:'West',emoji:'🥁',festival:'Ganesh Chaturthi',art:'Warli Painting',dance:'Lavani',heritage:'Ajanta Caves'},

  {name:'Manipur',region:'North East',emoji:'🌺',festival:'Yaoshang',art:'Wangkhei Silk',dance:'Manipuri',heritage:'Kangla Fort'},

  {name:'Meghalaya',region:'North East',emoji:'☁️',festival:'Wangala',art:'Bamboo Craft',dance:'Shad Suk Mynsiem',heritage:'Living Root Bridges'},

  {name:'Mizoram',region:'North East',emoji:'🎋',festival:'Chapchar Kut',art:'Bamboo Craft',dance:'Cheraw',heritage:"Solomon's Temple"},

  {name:'Nagaland',region:'North East',emoji:'🪶',festival:'Hornbill Festival',art:'Naga Shawls',dance:'Chang Lo',heritage:'Kachari Ruins'},

  {name:'Odisha',region:'East',emoji:'🛕',festival:'Rath Yatra',art:'Pattachitra',dance:'Odissi',heritage:'Konark Sun Temple'},

  {name:'Punjab',region:'North',emoji:'🌾',festival:'Baisakhi',art:'Phulkari',dance:'Bhangra',heritage:'Golden Temple'},

  {name:'Rajasthan',region:'West',emoji:'🏰',festival:'Pushkar Fair',art:'Blue Pottery',dance:'Ghoomar',heritage:'Amer Fort'},

  {name:'Sikkim',region:'North East',emoji:'⛰️',festival:'Losar',art:'Thangka Painting',dance:'Singhi Chham',heritage:'Rumtek Monastery'},

  {name:'Tamil Nadu',region:'South',emoji:'🌺',festival:'Pongal',art:'Tanjore Painting',dance:'Bharatanatyam',heritage:'Brihadisvara Temple'},

  {name:'Telangana',region:'South',emoji:'🌸',festival:'Bathukamma',art:'Bidri Craft',dance:'Perini Shivatandavam',heritage:'Charminar'},

  {name:'Tripura',region:'North East',emoji:'🌿',festival:'Kharchi Puja',art:'Bamboo Craft',dance:'Hojagiri',heritage:'Neermahal'},

  {name:'Uttar Pradesh',region:'North',emoji:'🕌',festival:'Holi',art:'Chikankari',dance:'Kathak',heritage:'Taj Mahal'},

  {name:'Uttarakhand',region:'North',emoji:'🏔️',festival:'Harela',art:'Aipan Art',dance:'Chholiya',heritage:'Kedarnath Temple'},

  {name:'West Bengal',region:'East',emoji:'🎭',festival:'Durga Puja',art:'Kantha Embroidery',dance:'Purulia Chhau',heritage:'Victoria Memorial'}

];


/* =========================================================
   DOM
   ========================================================= */

const grid = document.getElementById('stateGrid');
const panel = document.getElementById('statePanel');
const searchInput = document.getElementById('stateSearch');
const stateCount = document.getElementById('stateCount');
const noResults = document.getElementById('noResults');
const regionButtons = [...document.querySelectorAll('.region-filter')];
const mapWrapper = document.querySelector('.india-svg-wrapper');

let activeRegion = 'All';
let query = '';
let selectedState = null;


/* =========================================================
   STORAGE
   ========================================================= */

function getXP() {
  return Number(localStorage.getItem('curiosoXP') || 0);
}

function getExploredStates() {
  try {
    return JSON.parse(
      localStorage.getItem('curiosoExploredStates') || '[]'
    );
  } catch {
    return [];
  }
}

function saveExploredStates(list) {
  localStorage.setItem(
    'curiosoExploredStates',
    JSON.stringify(list)
  );
}


/* =========================================================
   FILTER
   ========================================================= */

function filteredStates() {

  return states.filter(state => {

    const regionMatch =
      activeRegion === 'All' ||
      state.region === activeRegion;

    const searchMatch =
      !query ||
      state.name.toLowerCase().includes(query);

    return regionMatch && searchMatch;
  });

}


/* =========================================================
   RENDER STATES
   ========================================================= */

function renderStates() {

  if (!grid) return;

  const items = filteredStates();

  grid.innerHTML = '';

  items.forEach((state) => {

    const index = states.indexOf(state);

    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'state-chip';
    button.dataset.state = state.name;

    button.setAttribute(
      'aria-label',
      `Explore ${state.name} culture`
    );

    button.innerHTML = `
      <span class="state-num">
        ${String(index + 1).padStart(2,'0')}
      </span>

      <span class="state-emoji">
        ${state.emoji}
      </span>

      <span>
        ${state.name}
      </span>
    `;

    button.addEventListener('click', () => {
      showState(state, button, true);
    });

    grid.appendChild(button);

  });


  stateCount.textContent =
    `${items.length} ${
      items.length === 1 ? 'state' : 'states'
    }`;

  if (noResults) {
    noResults.hidden = items.length !== 0;
    noResults.classList.toggle('is-visible', items.length === 0);
  }


  if (selectedState) {

    const active =
      [...grid.querySelectorAll('.state-chip')]
        .find(
          el => el.dataset.state === selectedState.name
        );

    if (active) {
      active.classList.add('active');
    }

  }

}


/* =========================================================
   CULTURAL PASSPORT
   ========================================================= */

function showState(
  state,
  button = null,
  addXP = true
) {

  selectedState = state;


  document
    .querySelectorAll('.state-chip.active')
    .forEach(el => el.classList.remove('active'));


  if (button) {

    button.classList.add('active');

  } else {

    const card =
      [...document.querySelectorAll('.state-chip')]
        .find(
          el => el.dataset.state === state.name
        );

    if (card) {
      card.classList.add('active');
    }

  }


  let explored =
    getExploredStates();

  const alreadyExplored =
    explored.includes(state.name);

  let currentXP = getXP();

  // Record the state first so the passport always shows fresh progress.
  if (addXP && !alreadyExplored) {
    explored = [...explored, state.name];
    saveExploredStates(explored);

    currentXP += 20;
    localStorage.setItem('curiosoXP', currentXP);

    showXPToast(state.name);
  }

  const progress =
    Math.min(
      100,
      Math.round(
        (explored.length / states.length) * 100
      )
    );


  panel.innerHTML = `

    <div class="passport-panel">


      <!-- HEADER -->

      <div class="passport-header">

        <div>

          <span class="passport-region">
            ${state.region.toUpperCase()} INDIA
          </span>

          <h2 class="passport-title">
            ${state.name}
          </h2>

        </div>


        <div class="passport-emoji">
          ${state.emoji}
        </div>

      </div>



      <!-- LABEL -->

      <div class="passport-label">

        <span>✦</span>

        CULTURAL PASSPORT

      </div>



      <!-- INTRO -->

      <p class="passport-intro">

        Discover the traditions, artistic expressions,
        celebrations and heritage that give
        ${state.name} its unique cultural identity.

      </p>



      <!-- CULTURAL FACTS -->

      <div class="passport-facts">


        <div class="passport-fact">

          <div class="fact-icon">
            🎉
          </div>

          <small>
            Festival
          </small>

          <strong>
            ${state.festival}
          </strong>

        </div>



        <div class="passport-fact">

          <div class="fact-icon">
            🎨
          </div>

          <small>
            Art & Craft
          </small>

          <strong>
            ${state.art}
          </strong>

        </div>



        <div class="passport-fact">

          <div class="fact-icon">
            💃
          </div>

          <small>
            Dance
          </small>

          <strong>
            ${state.dance}
          </strong>

        </div>



        <div class="passport-fact">

          <div class="fact-icon">
            🏛️
          </div>

          <small>
            Heritage
          </small>

          <strong>
            ${state.heritage}
          </strong>

        </div>


      </div>



      <!-- PROGRESS -->

      <div class="passport-progress">

        <div class="progress-heading">

          <span>
            CULTURE JOURNEY
          </span>

          <span class="xp-pill">
            ${currentXP} XP
          </span>

        </div>


        <div class="passport-progress-track">

          <div
            class="passport-progress-fill"
            style="width:${progress}%"
          ></div>

        </div>


        <div class="passport-progress-bottom">

          <span>
            ${explored.length}/${states.length} states explored
          </span>

          <span>
            ${getCultureLevel(currentXP)}
          </span>

        </div>

      </div>



      <!-- ACTIONS -->

      <div class="passport-actions">


        <a
          class="passport-action primary"
          href="festival.html"
        >
          🎉 Festivals
        </a>


        <a
          class="passport-action"
          href="Art&Crafts.html"
        >
          🎨 Art & Craft
        </a>


        <a
          class="passport-action"
          href="Dance.html"
        >
          💃 Dance
        </a>


        <a
          class="passport-action"
          href="Heritage.html"
        >
          🏛️ Heritage
        </a>


        <a
          class="passport-action primary"
          href="index.html#quiz"
          style="grid-column:1/-1"
        >
          🎯 Test Your Knowledge →
        </a>


      </div>

    </div>

  `;


  /* Update after XP */

  updateJourneyProgress();

  highlightSVGState(state);


  /* Mobile */

  if (window.innerWidth < 1050) {

    setTimeout(() => {

      panel.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });

    }, 100);

  }

}


/* =========================================================
   LEVEL
   ========================================================= */

function getCultureLevel(xp) {

  if (xp >= 500)
    return 'Culture Master';

  if (xp >= 300)
    return 'Heritage Explorer';

  if (xp >= 150)
    return 'Culture Adventurer';

  if (xp >= 60)
    return 'Culture Seeker';

  return 'Curious Explorer';

}


/* =========================================================
   XP TOAST
   ========================================================= */

function showXPToast(stateName) {

  const old =
    document.querySelector(
      '.culture-xp-toast'
    );

  if (old) old.remove();


  const toast =
    document.createElement('div');

  toast.className =
    'culture-xp-toast';


  toast.innerHTML = `

    <div class="xp-toast-icon">
      ✦
    </div>

    <div>

      <strong>
        +20 XP • ${stateName}
      </strong>

      <small>
        New culture discovered!
      </small>

    </div>

  `;


  document.body.appendChild(toast);


  setTimeout(() => {
    toast.remove();
  }, 3400);

}


/* =========================================================
   JOURNEY PROGRESS
   ========================================================= */

function updateJourneyProgress() {

  const explored =
    getExploredStates().length;

  const percentage =
    Math.min(
      100,
      Math.round(
        (explored / states.length) * 100
      )
    );


  let progress =
    document.querySelector(
      '.culture-progress'
    );


  if (!progress) {

    progress =
      document.createElement('div');

    progress.className =
      'culture-progress';


    const visual =
      document.querySelector(
        '.culture-map-visual'
      );


    if (visual) {
      visual.after(progress);
    }

  }


  if (!progress) return;


  progress.innerHTML = `

    <div class="progress-heading">

      <span>
        YOUR CULTURE JOURNEY
      </span>

      <span class="xp-pill">
        ${getXP()} XP
      </span>

    </div>


    <div class="progress-track">

      <div
        class="progress-fill"
        style="width:${percentage}%"
      ></div>

    </div>


    <div class="progress-meta">

      <span>
        ${explored}/${states.length} states explored
      </span>

      <span>
        ${getCultureLevel(getXP())}
      </span>

    </div>

  `;

}


/* =========================================================
   REGION FILTER
   ========================================================= */

regionButtons.forEach(button => {

  button.addEventListener(
    'click',
    () => {

      activeRegion =
        button.dataset.region;

      regionButtons.forEach(btn => {

        btn.classList.toggle(
          'active',
          btn === button
        );

      });

      renderStates();

    }
  );

});


/* =========================================================
   SEARCH
   ========================================================= */

if (searchInput) {

  searchInput.addEventListener(
    'input',
    event => {

      query =
        event.target.value
          .trim()
          .toLowerCase();

      renderStates();

      // If the search resolves to one state, keep the map/passport in sync.
      const matches = filteredStates();
      if (matches.length === 1 && query) {
        const onlyState = matches[0];
        const card = [...document.querySelectorAll('.state-chip')]
          .find(el => el.dataset.state === onlyState.name);
        showState(onlyState, card || null, false);
      }

    }
  );

  searchInput.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;

    const matches = filteredStates();
    if (matches.length > 0) {
      event.preventDefault();
      const first = matches[0];
      const card = [...document.querySelectorAll('.state-chip')]
        .find(el => el.dataset.state === first.name);
      showState(first, card || null, true);
    }
  });

}


/* =========================================================
   KEYBOARD SEARCH
   ========================================================= */

document.addEventListener(
  'keydown',
  event => {

    if (
      event.key === '/' &&
      document.activeElement !== searchInput
    ) {

      event.preventDefault();

      searchInput?.focus();

    }

  }
);


/* =========================================================
   SVG MAP
   ========================================================= */

async function loadIndiaMap() {

  if (!mapWrapper) return;

  const LOCAL_SVG = 'maps/india-states.svg';
  const REMOTE_SVG = 'https://simplemaps.com/static/svg/country/in/admin1/in.svg';
  const LOCAL_IMAGE = 'maps/india-states-broken.webp';

  const prepareSVG = (svg) => {
    svg.classList.add('india-svg-map');
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Interactive map of India');
    mapWrapper.innerHTML = '';
    mapWrapper.appendChild(document.importNode(svg, true));
    setupSVGStates(mapWrapper.querySelector('svg'));
  };

  const tryInlineSVG = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Map request failed (${response.status})`);
    const text = await response.text();
    const parsed = new DOMParser().parseFromString(text, 'image/svg+xml');
    const parserError = parsed.querySelector('parsererror');
    const svg = parsed.querySelector('svg');
    if (parserError || !svg) throw new Error('Valid SVG markup was not returned.');
    prepareSVG(svg);
    return true;
  };

  try {
    await tryInlineSVG(LOCAL_SVG);
    return;
  } catch (localError) {
    console.warn('CURIOSO: local India SVG unavailable; using SimpleMaps fallback.', localError);
  }

  try {
    await tryInlineSVG(REMOTE_SVG);
    return;
  } catch (remoteError) {
    console.warn('CURIOSO: inline remote SVG unavailable; keeping remote map image.', remoteError);
    if (!mapWrapper.querySelector('img.india-svg-fallback')) {
      mapWrapper.innerHTML = '';
      const img = document.createElement('img');
      img.src = REMOTE_SVG;
      img.className = 'india-svg-map india-svg-fallback';
      img.alt = 'Map of India showing Indian states';
      img.onerror = () => {
        img.onerror = null;
        img.src = LOCAL_IMAGE;
        img.classList.add('india-svg-local-fallback');
      };
      mapWrapper.appendChild(img);
    }
  }
}


/* =========================================================
   SVG STATE CONNECTION
   ========================================================= */

function setupSVGStates(svg) {

  if (!svg) return;


  const elements =
    [
      ...svg.querySelectorAll(
        'path, polygon, polyline, g, rect'
      )
    ];


  let connected = 0;


  elements.forEach(element => {

    const searchable =
      [

        element.id,

        element.getAttribute(
          'data-name'
        ),

        element.getAttribute(
          'data-state'
        ),

        element.getAttribute(
          'name'
        ),

        element.getAttribute(
          'title'
        ),

        element.getAttribute(
          'aria-label'
        )

      ]
        .filter(Boolean)
        .join(' ');


    const state =
      findState(searchable);


    if (!state) return;


    connected++;


    element.dataset.curiosoState =
      state.name;


    element.style.cursor =
      'pointer';


    if (
      element.tagName.toLowerCase() !== 'g'
    ) {

      element.style.fill =
        getRegionColor(
          state.region
        );

      element.style.stroke =
        '#ffffff';

      element.style.strokeWidth =
        '0.8';

    }


    element.addEventListener(
      'mouseenter',
      () => {

        element.style.filter =
          'brightness(1.12) saturate(1.15)';

      }
    );


    element.addEventListener(
      'mouseleave',
      () => {

        if (
          element.dataset.curiosoSelected !== 'true'
        ) {

          element.style.filter = '';

        }

      }
    );


    element.addEventListener(
      'click',
      event => {

        event.stopPropagation();

        const matchingCard =
          [...document.querySelectorAll(
            '.state-chip'
          )]
            .find(
              card =>
                card.dataset.state ===
                state.name
            );


        showState(
          state,
          matchingCard || null,
          true
        );

      }
    );

  });


  console.log(
    `CURIOSO: ${connected} SVG states connected.`
  );

}


/* =========================================================
   FIND STATE
   ========================================================= */

function findState(text) {

  const normalized =
    String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');


  if (!normalized) return null;

  const simpleMapsIds = {
    inan:'Andaman and Nicobar Islands', inap:'Andhra Pradesh', inar:'Arunachal Pradesh', inas:'Assam',
    inbr:'Bihar', inct:'Chhattisgarh', inga:'Goa', ingj:'Gujarat', inhr:'Haryana', inhp:'Himachal Pradesh',
    injh:'Jharkhand', inka:'Karnataka', inkl:'Kerala', inmp:'Madhya Pradesh', inmh:'Maharashtra', inmn:'Manipur',
    inml:'Meghalaya', inmz:'Mizoram', innl:'Nagaland', inor:'Odisha', inpb:'Punjab', inrj:'Rajasthan', insk:'Sikkim',
    intn:'Tamil Nadu', intg:'Telangana', intr:'Tripura', inup:'Uttar Pradesh', inut:'Uttarakhand', inwb:'West Bengal'
  };

  if (simpleMapsIds[normalized]) {
    return states.find(state => state.name === simpleMapsIds[normalized]) || null;
  }


  for (const state of states) {

    const name =
      state.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');


    if (
      normalized.includes(name)
    ) {

      return state;

    }

  }


  const aliases = {

    ap: 'Andhra Pradesh',

    andhra: 'Andhra Pradesh',

    arunachal: 'Arunachal Pradesh',

    chattisgarh: 'Chhattisgarh',

    chhattisgarh: 'Chhattisgarh',

    mp: 'Madhya Pradesh',

    madhya: 'Madhya Pradesh',

    up: 'Uttar Pradesh',

    uttaranchal: 'Uttarakhand',

    orissa: 'Odisha',

    tamilnadu: 'Tamil Nadu',

    westbengal: 'West Bengal'

  };


  for (
    const alias in aliases
  ) {

    if (
      normalized.includes(alias)
    ) {

      return states.find(
        state =>
          state.name ===
          aliases[alias]
      );

    }

  }


  return null;

}


/* =========================================================
   REGION COLOR
   ========================================================= */

function getRegionColor(region) {

  const colors = {

    North: '#c88a4a',

    South: '#4f896d',

    East: '#8a688c',

    West: '#c46d53',

    Central: '#7f9463',

    'North East': '#6476a0'

  };


  return (
    colors[region] ||
    '#4f896d'
  );

}


/* =========================================================
   SVG SELECTED STATE
   ========================================================= */

function highlightSVGState(state) {

  const svg =
    document.querySelector(
      '.india-svg-wrapper svg'
    );


  if (!svg) return;


  svg
    .querySelectorAll(
      '[data-curioso-selected="true"]'
    )
    .forEach(element => {

      element.dataset.curiosoSelected =
        'false';

      element.style.filter =
        '';

      element.style.strokeWidth =
        '0.8';

      element.style.stroke =
        '#ffffff';

    });


  svg
    .querySelectorAll(
      '[data-curioso-state]'
    )
    .forEach(element => {

      if (
        element.dataset.curiosoState ===
        state.name
      ) {

        element.dataset.curiosoSelected =
          'true';


        element.style.filter =
          'brightness(1.18) saturate(1.25) drop-shadow(0 7px 9px rgba(18,63,49,.28))';


        element.style.stroke =
          '#d8a64a';

        element.style.strokeWidth =
          '2';

      }

    });

}


/* =========================================================
   START
   ========================================================= */

function initCultureMap() {

  renderStates();

  updateJourneyProgress();

  loadIndiaMap();

}


initCultureMap();