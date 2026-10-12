let currentQuestion = 0; 

 

let points = 0; 

 

let answered = false; 

 

 

/* ========================================= 

   50 QUESTIONS 

========================================= */ 

 

const questions = [ 

 

    /* ========================= 

       FESTIVALS 

    ========================= */ 

 

    { 

        question: "Which festival is known as the Festival of Lights?", 

        options: ["Holi", "Diwali", "Eid", "Onam"], 

        answer: "Diwali", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Holi is popularly known as the festival of what?", 

        options: ["Colours", "Lights", "Harvest", "Flowers"], 

        answer: "Colours", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Onam is mainly celebrated in which Indian state?", 

        options: ["Kerala", "Punjab", "Gujarat", "Assam"], 

        answer: "Kerala", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Bihu is a major festival associated with which state?", 

        options: ["Assam", "Rajasthan", "Goa", "Bihar"], 

        answer: "Assam", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Pongal is mainly celebrated in which state?", 

        options: ["Tamil Nadu", "Punjab", "Haryana", "Odisha"], 

        answer: "Tamil Nadu", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Durga Puja is especially associated with which state?", 

        options: ["West Bengal", "Gujarat", "Kerala", "Maharashtra"], 

        answer: "West Bengal", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Garba is traditionally associated with which festival?", 

        options: ["Navratri", "Baisakhi", "Onam", "Bihu"], 

        answer: "Navratri", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Baisakhi is especially important in which state?", 

        options: ["Punjab", "Kerala", "Goa", "Assam"], 

        answer: "Punjab", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Ganesh Chaturthi is celebrated with special enthusiasm in which state?", 

        options: ["Maharashtra", "Punjab", "Sikkim", "Haryana"], 

        answer: "Maharashtra", 

        category: "Festivals" 

    }, 

 

    { 

        question: "Which festival celebrates the birth of Lord Krishna?", 

        options: ["Janmashtami", "Diwali", "Holi", "Pongal"], 

        answer: "Janmashtami", 

        category: "Festivals" 

    }, 

 

 

    /* ========================= 

       ART & CRAFTS 

    ========================= */ 

 

    { 

        question: "Madhubani painting is traditionally associated with which state?", 

        options: ["Bihar", "Kerala", "Punjab", "Gujarat"], 

        answer: "Bihar", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Warli painting is associated with which region?", 

        options: ["Maharashtra", "Assam", "Punjab", "Goa"], 

        answer: "Maharashtra", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Pattachitra is a traditional art form strongly associated with which state?", 

        options: ["Odisha", "Haryana", "Punjab", "Sikkim"], 

        answer: "Odisha", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Phulkari embroidery is traditionally associated with which state?", 

        options: ["Punjab", "Kerala", "Bihar", "Goa"], 

        answer: "Punjab", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Blue Pottery is famously associated with which Indian city?", 

        options: ["Jaipur", "Kolkata", "Chennai", "Patna"], 

        answer: "Jaipur", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Chikankari embroidery is strongly associated with which city?", 

        options: ["Lucknow", "Jaipur", "Mumbai", "Kochi"], 

        answer: "Lucknow", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Kalamkari is a traditional art form associated mainly with which region?", 

        options: ["Andhra Pradesh and Telangana", "Punjab", "Himachal Pradesh", "Goa"], 

        answer: "Andhra Pradesh and Telangana", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Which Indian craft is famous for intricate metalwork from Odisha?", 

        options: ["Dhokra", "Phulkari", "Chikankari", "Kalamkari"], 

        answer: "Dhokra", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Kashmir is well known for which traditional craft?", 

        options: ["Pashmina", "Phulkari", "Madhubani", "Pattachitra"], 

        answer: "Pashmina", 

        category: "Art & Crafts" 

    }, 

 

    { 

        question: "Which traditional painting style is associated with Rajasthan?", 

        options: ["Phad", "Warli", "Madhubani", "Pattachitra"], 

        answer: "Phad", 

        category: "Art & Crafts" 

    }, 

 

 

    /* ========================= 

       DANCE 

    ========================= */ 

 

    { 

        question: "Bharatanatyam originated in which Indian state?", 

        options: ["Tamil Nadu", "Punjab", "Assam", "Gujarat"], 

        answer: "Tamil Nadu", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Kathak is traditionally associated with which region of India?", 

        options: ["North India", "South India", "North-East India", "Western India"], 

        answer: "North India", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Kathakali is a classical dance-drama form from which state?", 

        options: ["Kerala", "Rajasthan", "Bihar", "Punjab"], 

        answer: "Kerala", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Kuchipudi originated in which state?", 

        options: ["Andhra Pradesh", "Punjab", "Gujarat", "Assam"], 

        answer: "Andhra Pradesh", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Odissi is a classical dance form from which state?", 

        options: ["Odisha", "Kerala", "Maharashtra", "Haryana"], 

        answer: "Odisha", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Manipuri dance is associated with which state?", 

        options: ["Manipur", "Mizoram", "Goa", "Bihar"], 

        answer: "Manipur", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Bhangra is traditionally associated with which state?", 

        options: ["Punjab", "Kerala", "Tamil Nadu", "Odisha"], 

        answer: "Punjab", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Ghoomar is a famous folk dance of which state?", 

        options: ["Rajasthan", "Assam", "Kerala", "Bihar"], 

        answer: "Rajasthan", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Garba is a popular traditional dance form of which state?", 

        options: ["Gujarat", "Punjab", "Odisha", "Bihar"], 

        answer: "Gujarat", 

        category: "Dance Forms" 

    }, 

 

    { 

        question: "Lavani is a traditional dance and music form associated with which state?", 

        options: ["Maharashtra", "Punjab", "Assam", "Kerala"], 

        answer: "Maharashtra", 

        category: "Dance Forms" 

    }, 

 

 

    /* ========================= 

       HERITAGE & MONUMENTS 

    ========================= */ 

 

    { 

        question: "The Taj Mahal is located in which city?", 

        options: ["Agra", "Delhi", "Jaipur", "Lucknow"], 

        answer: "Agra", 

        category: "Heritage" 

    }, 

 

    { 

        question: "The Red Fort is located in which city?", 

        options: ["Delhi", "Mumbai", "Agra", "Kolkata"], 

        answer: "Delhi", 

        category: "Heritage" 

    }, 

 

    { 

        question: "Gateway of India is located in which city?", 

        options: ["Mumbai", "Delhi", "Chennai", "Kolkata"], 

        answer: "Mumbai", 

        category: "Heritage" 

    }, 

 

    { 

        question: "Hawa Mahal is located in which city?", 

        options: ["Jaipur", "Agra", "Delhi", "Udaipur"], 

        answer: "Jaipur", 

        category: "Heritage" 

    }, 

 

    { 

        question: "Qutub Minar is located in which city?", 

        options: ["Delhi", "Agra", "Jaipur", "Mumbai"], 

        answer: "Delhi", 

        category: "Heritage" 

    }, 

 

    { 

        question: "The Konark Sun Temple is located in which state?", 

        options: ["Odisha", "Gujarat", "Kerala", "Bihar"], 

        answer: "Odisha", 

        category: "Heritage" 

    }, 

 

    { 

        question: "Ajanta Caves are located in which state?", 

        options: ["Maharashtra", "Rajasthan", "Punjab", "Goa"], 

        answer: "Maharashtra", 

        category: "Heritage" 

    }, 

 

    { 

        question: "Ellora Caves are located in which state?", 

        options: ["Maharashtra", "Kerala", "Assam", "Haryana"], 

        answer: "Maharashtra", 

        category: "Heritage" 

    }, 

 

    { 

        question: "The Sanchi Stupa is located in which state?", 

        options: ["Madhya Pradesh", "Uttar Pradesh", "Gujarat", "Bihar"], 

        answer: "Madhya Pradesh", 

        category: "Heritage" 

    }, 

 

    { 

        question: "The Charminar is located in which city?", 

        options: ["Hyderabad", "Bengaluru", "Chennai", "Pune"], 

        answer: "Hyderabad", 

        category: "Heritage" 

    }, 

 

 

    /* ========================= 

       HISTORY & CULTURE 

    ========================= */ 

 

    { 

        question: "Which ancient civilization is associated with Harappa?", 

        options: [ 

            "Indus Valley Civilization", 

            "Roman Civilization", 

            "Greek Civilization", 

            "Mayan Civilization" 

        ], 

        answer: "Indus Valley Civilization", 

        category: "History" 

    }, 

 

    { 

        question: "The national animal of India is?", 

        options: [ 

            "Lion", 

            "Tiger", 

            "Elephant", 

            "Peacock" 

        ], 

        answer: "Tiger", 

        category: "Culture" 

    }, 

 

    { 

        question: "The national bird of India is?", 

        options: [ 

            "Peacock", 

            "Eagle", 

            "Parrot", 

            "Swan" 

        ], 

        answer: "Peacock", 

        category: "Culture" 

    }, 

 

    { 

        question: "What is the national flower of India?", 

        options: [ 

            "Rose", 

            "Lotus", 

            "Sunflower", 

            "Marigold" 

        ], 

        answer: "Lotus", 

        category: "Culture" 

    }, 

 

    { 

        question: "Which river is traditionally regarded as one of India's major sacred rivers?", 

        options: [ 

            "Ganga", 

            "Narmada", 

            "Godavari", 

            "Kaveri" 

        ], 

        answer: "Ganga", 

        category: "Culture" 

    }, 

 

    { 

        question: "Which traditional Indian board game is known as an ancient strategy game?", 

        options: [ 

            "Chess", 

            "Ludo", 

            "Carrom", 

            "Snakes and Ladders" 

        ], 

        answer: "Chess", 

        category: "Traditional Games" 

    }, 

 

    { 

        question: "Yoga originated in which country?", 

        options: [ 

            "India", 

            "China", 

            "Japan", 

            "Greece" 

        ], 

        answer: "India", 

        category: "Culture" 

    }, 

 

    { 

        question: "Which language is associated with the classical literature of ancient Tamil culture?", 

        options: [ 

            "Tamil", 

            "Punjabi", 

            "Bengali", 

            "Marathi" 

        ], 

        answer: "Tamil", 

        category: "Culture" 

    }, 

 

    { 

        question: "Which Indian city is popularly known as the Pink City?", 

        options: [ 

            "Jaipur", 

            "Jodhpur", 

            "Udaipur", 

            "Bikaner" 

        ], 

        answer: "Jaipur", 

        category: "Heritage" 

    }, 

 

    { 

        question: "Which Indian city is popularly known as the City of Lakes?", 

        options: [ 

            "Udaipur", 

            "Jaipur", 

            "Agra", 

            "Varanasi" 

        ], 

        answer: "Udaipur", 

        category: "Heritage" 

    } 

 

]; 

 

 

/* ========================================= 

   LOAD QUESTION 

========================================= */ 

 

function loadQuestion() { 

 

    answered = false; 

 

 

    const question = 

        questions[currentQuestion]; 

 

 

    document.getElementById("question") 

        .textContent = question.question; 

 

 

    document.getElementById("questionNumber") 

        .textContent = 

        "Question " + 

        (currentQuestion + 1) + 

        " / " + 

        questions.length; 

 

 

    const optionsContainer = 

        document.getElementById("options"); 

 

 

    optionsContainer.innerHTML = ""; 

 

 

    // Shuffle options so the correct answer
// is not always in the same position
const shuffledOptions = [...question.options];

for (let i = shuffledOptions.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [shuffledOptions[i], shuffledOptions[j]] =
        [shuffledOptions[j], shuffledOptions[i]];
}

shuffledOptions.forEach(function(option) {

    const button =
        document.createElement("button");

    button.textContent = option;

    button.onclick = function() {

        checkAnswer(option);

    };

    optionsContainer.appendChild(button);

});

 

 

    document.getElementById("result") 

        .style.display = "none"; 

 

 

    document.getElementById("nextButton") 

        .style.display = "none"; 

 

} 

 

 

/* ========================================= 

   CHECK ANSWER 

========================================= */ 

 

function checkAnswer(selectedAnswer) { 

 

    if (answered) { 

        return; 

    } 

 

 

    answered = true; 

 

 

    const question = 

        questions[currentQuestion]; 

 

 

    const result = 

        document.getElementById("result"); 

 

 

    result.style.display = "block"; 

 

 

    if (selectedAnswer === question.answer) { 

 

        points += 100; 

 

 

        document.getElementById("points") 

            .textContent = points; 

 

 

        result.textContent = 

            "✅ Correct! +100 points"; 

 

 

        updateBadge(); 

 

    } 

 

    else { 

 

        result.textContent = 

            "❌ Wrong answer! Correct answer: " + 

            question.answer; 

 

    } 

 

 

    document.getElementById("nextButton") 

        .style.display = "inline-block"; 

 

} 

 

 

/* ========================================= 

   NEXT QUESTION 

========================================= */ 

 

function nextQuestion() { 

 

    currentQuestion++; 

 

 

    if (currentQuestion >= questions.length) { 

 

        showFinalResult(); 

 

        return; 

 

    } 

 

 

    loadQuestion(); 

 

} 

 

 

/* ========================================= 

   BADGE SYSTEM 

========================================= */ 

 

function updateBadge() { 

 

    const badge = 

        document.getElementById("badgeIcon"); 

 

 

    if (points >= 4000) { 

 

        badge.textContent = "👑"; 

 

    } 

 

    else if (points >= 3000) { 

 

        badge.textContent = "💎"; 

 

    } 

 

    else if (points >= 2000) { 

 

        badge.textContent = "🥇"; 

 

    } 

 

    else if (points >= 1000) { 

 

        badge.textContent = "🥈"; 

 

    } 

 

    else if (points >= 500) { 

 

        badge.textContent = "🥉"; 

 

    } 

 

} 

 

 

/* ========================================= 

   FINAL RESULT 

========================================= */ 

 

function showFinalResult() { 

 

    const quiz = 

        document.querySelector(".quiz"); 

 

 

    let percentage = 

        Math.round( 

            (points / 

            (questions.length * 100)) 

            * 100 

        ); 

 

 

    let badge; 

 

 

    if (percentage >= 80) { 

 

        badge = "👑 Culture Master"; 

 

    } 

 

    else if (percentage >= 60) { 

 

        badge = "🥇 Culture Explorer"; 

 

    } 

 

    else if (percentage >= 40) { 

 

        badge = "🥈 Heritage Learner"; 

 

    } 

 

    else { 

 

        badge = "🥉 Culture Beginner"; 

 

    } 

 

 

    quiz.innerHTML = ` 

 

        <div style="text-align:center"> 

 

            <div style=" 

                font-size:65px; 

                margin-bottom:15px; 

            "> 

                🎉 

            </div> 

 

 

            <h2> 

                Quiz Completed! 

            </h2> 

 

 

            <p style=" 

                margin:20px 0; 

                color:#68727a; 

            "> 

 

                You completed all 

                50 Indian culture questions. 

 

            </p> 

 

 

            <div style=" 

                font-size:28px; 

                font-weight:bold; 

                color:#236b55; 

                margin:15px; 

            "> 

 

                ${points} Points 

 

            </div> 

 

 

            <div style=" 

                font-size:20px; 

                margin:15px; 

            "> 

 

                Score: ${percentage}% 

 

            </div> 

 

 

            <div style=" 

                font-size:25px; 

                margin:20px; 

            "> 

 

                ${badge} 

 

            </div> 

 

 

            <button 

                onclick="restartQuiz()" 

                style=" 

                    padding:13px 22px; 

                    border:none; 

                    border-radius:12px; 

                    background:#236b55; 

                    color:white; 

                    font-weight:bold; 

                    cursor:pointer; 

                "> 

 

                🔄 Play Again 

 

            </button> 

 

        </div> 

 

    `; 

 

} 

 

 

/* ========================================= 

   RESTART QUIZ 

========================================= */ 

 

function restartQuiz() { 

 

    currentQuestion = 0; 

 

    points = 0; 

 

    answered = false; 

 

 

    location.reload(); 

 

} 

 

 

/* ========================================= 

   START LEARNING 

========================================= */ 

 

function startLearning() { 

 

    document 

        .getElementById("quiz") 

        .scrollIntoView({ 

            behavior: "smooth" 

        }); 

 

} 

 

 

/* ========================================= 

   EXPLORE CULTURE 

========================================= */ 

 

function exploreCulture() { 

 

    document 

        .getElementById("explore") 

        .scrollIntoView({ 

            behavior: "smooth" 

        }); 

 

} 

 

 

/* ========================================= 

   START QUIZ 

========================================= */ 

 

loadQuestion(); 
