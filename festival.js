/* =========================================================
   CURIOSO — FESTIVAL PAGE
   28 Indian States + Festivals
   ========================================================= */


/* =========================================================
   FESTIVAL DATA
   ========================================================= */

const festivals = {

    ugadi: {
        title: "Ugadi",
        image: "images/festivals/Ugadi.jpg",
        description: "Ugadi is the traditional New Year festival celebrated in Andhra Pradesh. It marks a new beginning and is celebrated with traditional food and rituals.",
        region: "Andhra Pradesh",
        time: "March / April",
        meaning: "New beginning",
        tradition: "Ugadi Pachadi"
    },

    losar: {
        title: "Losar",
        image: "images/festivals/Losar.jpg",
        description: "Losar is the Tibetan Buddhist New Year festival celebrated in Arunachal Pradesh and other Himalayan regions.",
        region: "Arunachal Pradesh",
        time: "February / March",
        meaning: "New Year",
        tradition: "Traditional rituals"
    },

    bihu: {
        title: "Bihu",
        image: "images/festivals/Bihu.jpg",
        description: "Bihu is the most important festival of Assam. It celebrates the agricultural cycle with music, dance and community celebrations.",
        region: "Assam",
        time: "April",
        meaning: "Harvest & celebration",
        tradition: "Bihu Dance"
    },

    chhath: {
        title: "Chhath Puja",
        image: "images/festivals/Chhath Puja.jpg",
        description: "Chhath Puja is a major festival of Bihar dedicated to the worship of the Sun God and nature.",
        region: "Bihar",
        time: "October / November",
        meaning: "Gratitude to the Sun",
        tradition: "Riverbank prayers"
    },

    bastar: {
        title: "Bastar Dussehra",
        image: "images/festivals/Bastar Dussehra.jpg",
        description: "Bastar Dussehra is a unique traditional festival of Chhattisgarh with a rich tribal cultural heritage.",
        region: "Chhattisgarh",
        time: "September / October",
        meaning: "Tribal tradition",
        tradition: "Tribal rituals"
    },

    goa: {
        title: "Goa Carnival",
        image: "images/festivals/Goa Carnival.jpg",
        description: "Goa Carnival is a colourful celebration known for parades, music, costumes and cultural performances.",
        region: "Goa",
        time: "February",
        meaning: "Joy & celebration",
        tradition: "Parades & music"
    },

    navratri: {
        title: "Navratri",
        image: "images/festivals/navratri.jpg",
        description: "Navratri is a nine-night festival dedicated to the worship of the divine feminine. Gujarat is especially famous for Garba and Dandiya.",
        region: "Gujarat",
        time: "September / October",
        meaning: "Devotion & strength",
        tradition: "Garba & Dandiya"
    },

    teej: {
        title: "Teej",
        image: "images/festivals/Teej.jpg",
        description: "Teej is a traditional festival celebrated especially by women with prayers, songs, fasting and cultural celebrations.",
        region: "Haryana",
        time: "July / August",
        meaning: "Tradition & devotion",
        tradition: "Songs & swings"
    },

    kullu: {
        title: "Kullu Dussehra",
        image: "images/festivals/Kullu Dussehra.jpg",
        description: "Kullu Dussehra is a famous cultural festival of Himachal Pradesh celebrated with processions and traditional rituals.",
        region: "Himachal Pradesh",
        time: "October",
        meaning: "Faith & tradition",
        tradition: "Rath procession"
    },

    sarhul: {
        title: "Sarhul",
        image: "images/festivals/Sarhul.jpg",
        description: "Sarhul is an important tribal festival of Jharkhand celebrating nature, trees and the arrival of spring.",
        region: "Jharkhand",
        time: "March / April",
        meaning: "Nature worship",
        tradition: "Traditional dance"
    },

    mysore: {
        title: "Mysore Dasara",
        image: "images/festivals/Mysore Dasara.jpg",
        description: "Mysore Dasara is a grand celebration in Karnataka known for illuminated palaces, processions and cultural performances.",
        region: "Karnataka",
        time: "September / October",
        meaning: "Victory of good",
        tradition: "Royal procession"
    },

    onam: {
        title: "Onam",
        image: "images/festivals/onam.jpg",
        description: "Onam is a major festival of Kerala. It celebrates the harvest season and is associated with the traditional story of King Mahabali.",
        region: "Kerala",
        time: "August / September",
        meaning: "Harvest & prosperity",
        tradition: "Pookalam & Sadya"
    },

    khajuraho: {
        title: "Khajuraho Dance Festival",
        image: "images/festivals/Khajuraho Dance Festival.jpg",
        description: "The Khajuraho Dance Festival celebrates classical Indian dance forms against the historic Khajuraho temples.",
        region: "Madhya Pradesh",
        time: "February",
        meaning: "Art & culture",
        tradition: "Classical dance"
    },

    ganesh: {
        title: "Ganesh Chaturthi",
        image: "images/festivals/Ganesh Chaturthi.jpg",
        description: "Ganesh Chaturthi celebrates Lord Ganesha with beautifully decorated idols, prayers, cultural programs and processions.",
        region: "Maharashtra",
        time: "August / September",
        meaning: "Wisdom & prosperity",
        tradition: "Ganesh idol celebration"
    },

    yaoshang: {
        title: "Yaoshang",
        image: "images/festivals/Yaoshang.jpg",
        description: "Yaoshang is a major festival of Manipur celebrated with colours, sports, dance and community activities.",
        region: "Manipur",
        time: "February / March",
        meaning: "Community & celebration",
        tradition: "Colours & sports"
    },

    wangala: {
        title: "Wangala",
        image: "images/festivals/Wangala.jpg",
        description: "Wangala is a harvest festival of the Garo people of Meghalaya, celebrated with traditional music and dance.",
        region: "Meghalaya",
        time: "November",
        meaning: "Harvest celebration",
        tradition: "Drums & dance"
    },

    chapchar: {
        title: "Chapchar Kut",
        image: "images/festivals/Chapchar Kut.jpg",
        description: "Chapchar Kut is a popular spring festival of Mizoram celebrated with traditional music, dance and cultural performances.",
        region: "Mizoram",
        time: "March",
        meaning: "Spring & community",
        tradition: "Cheraw dance"
    },

    hornbill: {
        title: "Hornbill Festival",
        image: "images/festivals/Hornbill Festival.jpg",
        description: "Hornbill Festival showcases the diverse tribal cultures, traditions, music and crafts of Nagaland.",
        region: "Nagaland",
        time: "December",
        meaning: "Cultural unity",
        tradition: "Tribal performances"
    },

    rath: {
        title: "Rath Yatra",
        image: "images/festivals/Rath Yatra.jpg",
        description: "Rath Yatra is a famous chariot festival of Odisha associated with Lord Jagannath and celebrated with grand processions.",
        region: "Odisha",
        time: "June / July",
        meaning: "Devotion",
        tradition: "Chariot procession"
    },

    baisakhi: {
        title: "Baisakhi",
        image: "images/festivals/baisakhi.jpg",
        description: "Baisakhi is an important harvest festival of Punjab celebrated with music, dance and community gatherings.",
        region: "Punjab",
        time: "April",
        meaning: "Harvest & new beginning",
        tradition: "Bhangra & community"
    },

    pushkar: {
        title: "Pushkar Fair",
        image: "images/festivals/Pushkar Fair.jpg",
        description: "Pushkar Fair is a famous cultural and livestock fair of Rajasthan known for traditional activities and colourful celebrations.",
        region: "Rajasthan",
        time: "October / November",
        meaning: "Culture & tradition",
        tradition: "Camel fair"
    },

    sikkimLosar: {
        title: "Losar",
        image: "images/festivals/Losar.jpg",
        description: "Losar is celebrated as the Tibetan Buddhist New Year in Sikkim with prayers, traditional ceremonies and cultural activities.",
        region: "Sikkim",
        time: "February / March",
        meaning: "New Year",
        tradition: "Monastery celebrations"
    },

    pongal: {
        title: "Pongal",
        image: "images/festivals/Pongal.jpg",
        description: "Pongal is the harvest festival of Tamil Nadu. It expresses gratitude to nature, the Sun and cattle.",
        region: "Tamil Nadu",
        time: "January",
        meaning: "Harvest & gratitude",
        tradition: "Pongal cooking"
    },

    bathukamma: {
        title: "Bathukamma",
        image: "images/festivals/Bathukamma.jpg",
        description: "Bathukamma is a colourful floral festival of Telangana where women create beautiful flower arrangements and celebrate together.",
        region: "Telangana",
        time: "September / October",
        meaning: "Flowers & celebration",
        tradition: "Floral arrangements"
    },

    kharchi: {
        title: "Kharchi Puja",
        image: "images/festivals/Kharchi Puja.jpg",
        description: "Kharchi Puja is an important traditional festival of Tripura involving prayers, rituals and cultural gatherings.",
        region: "Tripura",
        time: "June / July",
        meaning: "Faith & tradition",
        tradition: "Temple rituals"
    },

    holi: {
        title: "Holi",
        image: "images/festivals/holi.jpg",
        description: "Holi is the vibrant festival of colours. People celebrate with colours, traditional food, music and togetherness.",
        region: "Uttar Pradesh",
        time: "February / March",
        meaning: "Joy & togetherness",
        tradition: "Colours & music"
    },

    harela: {
        title: "Harela",
        image: "images/festivals/Harela.jpg",
        description: "Harela is a traditional festival of Uttarakhand associated with greenery, agriculture and the beginning of the monsoon season.",
        region: "Uttarakhand",
        time: "July",
        meaning: "Greenery & prosperity",
        tradition: "Planting & nature"
    },

    durga: {
        title: "Durga Puja",
        image: "images/festivals/Durga Puja.jpg",
        description: "Durga Puja is a major festival of West Bengal celebrating Goddess Durga through artistic pandals, rituals, music and cultural events.",
        region: "West Bengal",
        time: "September / October",
        meaning: "Victory of good",
        tradition: "Pandals & celebrations"
    }

};


/* =========================================================
   COMPATIBILITY ALIASES
   ========================================================= */

festivals.carnival = festivals.goa;
festivals.sikkimlosar = festivals.sikkimLosar;


/* =========================================================
   SHOW FESTIVAL
   ========================================================= */

function showFestival(key, button) {

    const festival = festivals[key];

    if (!festival) {
        console.log("Festival data not found:", key);
        return;
    }

    document
        .querySelectorAll(".festival-card")
        .forEach(card => {
            card.classList.remove("active");
        });

    if (button) {
        button.classList.add("active");
    }

    const title =
        document.getElementById("festivalTitle");

    if (title) {
        title.textContent = festival.title;
    }

    const description =
        document.getElementById("festivalDescription");

    if (description) {
        description.textContent = festival.description;
    }

    const region =
        document.getElementById("festivalRegion");

    if (region) {
        region.textContent = festival.region;
    }

    const time =
        document.getElementById("festivalTime");

    if (time) {
        time.textContent = festival.time;
    }

    const meaning =
        document.getElementById("festivalMeaning");

    if (meaning) {
        meaning.textContent = festival.meaning;
    }

    const tradition =
        document.getElementById("festivalTradition");

    if (tradition) {
        tradition.textContent = festival.tradition;
    }

    const image =
        document.querySelector("#festivalEmoji img");

    if (image) {
        image.src = festival.image;
        image.alt = festival.title;
    }

    const story =
        document.getElementById("story");

    if (story) {
        story.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =========================================================
   AUTOMATIC FESTIVAL CARD IMAGES
   ========================================================= */

function loadFestivalCardImages() {

    const cards =
        document.querySelectorAll(".festival-card");

    cards.forEach(card => {

        const onclickCode =
            card.getAttribute("onclick");

        if (!onclickCode) return;

        const match =
            onclickCode.match(
                /showFestival\(['"]([^'"]+)['"]/
            );

        if (!match) return;

        let key = match[1];

        /* Fix old HTML keys */
        if (key === "carnival") {
            key = "goa";
        }

        if (key === "sikkimlosar") {
            key = "sikkimLosar";
        }

        const festival =
            festivals[key];

        if (!festival) {
            console.log(
                "Festival image not found:",
                key
            );
            return;
        }

        /* Find old emoji/icon box */
        let imageBox =
            card.querySelector(".festival-icon");

        /* Already an image box */
        if (!imageBox) {
            imageBox =
                card.querySelector(".festival-image");
        }

        if (!imageBox) return;

        imageBox.className =
            "festival-image";

        imageBox.innerHTML = `
            <img
                src="${festival.image}"
                alt="${festival.title}"
                loading="lazy"
            >
        `;

    });
}


/* =========================================================
   DID YOU KNOW FACTS
   ========================================================= */

const facts = [

    "India celebrates hundreds of festivals throughout the year.",

    "Bihu is an important festival of Assam.",

    "Onam is a major harvest festival of Kerala.",

    "Pongal is a major harvest festival of Tamil Nadu.",

    "Durga Puja is one of the major cultural celebrations of West Bengal.",

    "Hornbill Festival celebrates the diverse cultural traditions of Nagaland.",

    "Bathukamma is known as a flower festival of Telangana.",

    "Holi is popularly known as the Festival of Colours.",

    "Baisakhi is an important harvest celebration of Punjab.",

    "Wangala is associated with harvest celebrations in Meghalaya."

];

let factIndex = 0;

function newFact() {

    const factText =
        document.getElementById("factText");

    if (!factText) return;

    factIndex++;

    if (factIndex >= facts.length) {
        factIndex = 0;
    }

    factText.textContent =
        facts[factIndex];
}


/* =========================================================
   QUIZ
   ========================================================= */

function checkAnswer(button, correct) {

    const result =
        document.getElementById("quizResult");

    if (!result) return;

    if (correct) {

        result.textContent =
            "🎉 Correct! Great job!";

        result.style.color =
            "#2e7d32";

    } else {

        result.textContent =
            "❌ Not quite. Try again!";

        result.style.color =
            "#c62828";
    }
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Load all card images */
        loadFestivalCardImages();

        /* Select first festival */
        const firstCard =
            document.querySelector(".festival-card");

        if (firstCard) {
            showFestival(
                "ugadi",
                firstCard
            );
        }

    }
);