// Quiz Configuration
const QUIZ_CONFIG = {
    timePerQuestion: 15,
    xpPerQuestion: 100,
    totalQuestions: 20,
    resetHours: 2,
    leaderboardSize: 50
};

// Game State
let gameState = {
    players: new Map(),
    currentQuestion: 0,
    currentPlayer: '',
    score: 0
};

// ALL 20 KITE AI QUESTIONS
const QUIZ_QUESTIONS = [
  {
    question: "What is the primary goal of DataHaven?",
    options: [
      "Creating a decentralized verifiable storage layer for the AI era",
      "Developing a centralized data analytics platform",
      "Building a decentralized AI chatbot",
      "Launching an on-chain gaming network"
    ],
    correct: 0
  },
  {
    question: "Which foundation launched DataHaven?",
    options: ["Moonbeam Foundation", "Ethereum Foundation", "Polkadot Foundation", "Cosmos Hub"],
    correct: 0
  },
  {
    question: "What is the native token of DataHaven?",
    options: ["$MOON", "$HAVE", "$DTH", "$DATA"],
    correct: 1
  },
  {
    question: "What is the total genesis supply of the $HAVE token?",
    options: ["10 Billion", "1 Billion", "100 Million", "5 Billion"],
    correct: 0
  },
  {
    question: "When was the blog post 'Your AI Trust Playbook' published?",
    options: ["June 2025", "May 5, 2025", "April 2025", "July 2025"],
    correct: 1
  },
  {
    question: "What is the annual fixed issuance of $HAVE tokens?",
    options: ["200M", "1B", "500M", "100M"],
    correct: 2
  },
  {
    question: "What percentage of $HAVE tokens are allocated to the Community?",
    options: ["40%", "50%", "20%", "30%"],
    correct: 1
  },
  {
    question: "Which ecosystem secures DataHaven through re-staking?",
    options: ["Polygon", "Arbitrum", "EigenLayer", "Avalanche"],
    correct: 2
  },
  {
    question: "What percentage of $HAVE tokens go to the Moonbeam Foundation?",
    options: ["10%", "20%", "5%", "15%"],
    correct: 0
  },
  {
    question: "Who is the Head of Product at DataHaven?",
    options: ["Aaron Evans", "Piotr Dziubecki", "Ryan Levy", "Alex DiNunzio"],
    correct: 1
  },
  {
    question: "When was the community campaign 'The Moose Awakens' announced?",
    options: ["July 5, 2025", "April 30, 2025", "May 19, 2025", "June 10, 2025"],
    correct: 2
  },
  {
    question: "Who is the Global Head of Business Development for DataHaven?",
    options: ["Sicco Naets", "Ryan Levy", "John Bridgewater", "Prasanna Ketheeswaran"],
    correct: 1
  },
  {
    question: "How much of the token supply is allocated to the Core Team & Contributors?",
    options: ["25%", "15%", "20%", "10%"],
    correct: 2
  },
  {
    question: "When was the 'Tokenomics Q&A' blog post published?",
    options: ["June 20, 2025", "August 2, 2025", "May 10, 2025", "July 15, 2025"],
    correct: 0
  },
  {
    question: "Which DEX partner helps enable $GLMR re-staking flows for DataHaven?",
    options: ["Curve", "StellaSwap", "Uniswap", "PancakeSwap"],
    correct: 1
  },
  {
    question: "Which statement about the $HAVE token is TRUE?",
    options: [
      "The token has NOT launched yet",
      "It is an NFT token",
      "Token contract is live on Ethereum",
      "The token has already launched"
    ],
    correct: 0
  },
  {
    question: "What percentage of $HAVE is allocated to the Treasury?",
    options: ["25%", "20%", "30%", "10%"],
    correct: 1
  },
  {
    question: "What official warning is mentioned on the Tokenomics page?",
    options: [
      "Only KYC holders can claim tokens",
      "No official $HAVE contract exists yet",
      "Avoid testnet bridge",
      "Token price is volatile"
    ],
    correct: 1
  },
  {
    question: "Which event panel featured DataHaven representatives like Ryan Levy?",
    options: ["Token2049", "ETHDenver", "Re:fundamentals / PMF Panel", "Web3Con Asia"],
    correct: 2
  },
  {
    question: "What symbol represents DataHaven’s brand identity?",
    options: ["A Tree", "A Wolf", "A Moose", "A Falcon"],
    correct: 2
  }
]

// SIMPLE INITIALIZATION THAT DEFINITELY WORKS
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Page loaded!');
    initializeQuiz();
});

function initializeQuiz() {
    console.log('🎯 Initializing quiz...');
    
    // Load saved players
    loadPlayers();
    updatePlayerDisplay();
    
    // Get buttons and inputs
    const joinBtn = document.getElementById('joinBtn');
    const usernameInput = document.getElementById('usernameInput');
    const playAgainBtn = document.getElementById('playAgainBtn');
    
    console.log('Join button found:', !!joinBtn);
    console.log('Username input found:', !!usernameInput);
    
    // Add click event to join button
    if (joinBtn) {
        joinBtn.onclick = function() {
            console.log('👉 Join button clicked!');
            handleStartQuiz();
        };
    }
    
    // Add enter key support
    if (usernameInput) {
        usernameInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                handleStartQuiz();
            }
        };
    }
    
    // Play again button
    if (playAgainBtn) {
        playAgainBtn.onclick = function() {
            showScreen('username');
            const usernameInput = document.getElementById('usernameInput');
            if (usernameInput) {
                usernameInput.value = '';
                usernameInput.focus();
            }
        };
    }
    
    // Start reset timer display
    startResetTimer();
    
    console.log('✅ Quiz initialized!');
}

function handleStartQuiz() {
    console.log('🎯 Handling start quiz...');
    
    const usernameInput = document.getElementById('usernameInput');
    const usernameError = document.getElementById('usernameError');
    
    if (!usernameInput) {
        console.error('❌ Username input not found!');
        return;
    }
    
    const username = usernameInput.value.trim();
    console.log('Username entered:', username);
    
    // Validation
    if (!username) {
        if (usernameError) {
            usernameError.textContent = 'Please enter a username!';
            usernameError.style.color = '#ff6b6b';
        }
        return;
    }
    
    if (username.length < 3) {
        if (usernameError) {
            usernameError.textContent = 'Username must be at least 3 characters!';
            usernameError.style.color = '#ff6b6b';
        }
        return;
    }
    
    // Clean up old players
    cleanupOldPlayers();
    
    // Check if username exists
    if (gameState.players.has(username)) {
        if (usernameError) {
            usernameError.textContent = 'Username used recently. Try after 2 hours.';
            usernameError.style.color = '#ff6b6b';
        }
        return;
    }
    
    // Clear error
    if (usernameError) {
        usernameError.textContent = '';
    }
    
    // START THE QUIZ
    startQuiz(username);
}

function startQuiz(username) {
    console.log('🚀 Starting quiz for:', username);
    
    // Add player
    gameState.players.set(username, {
        username: username,
        score: 0,
        joinedAt: new Date().toISOString()
    });
    
    savePlayers();
    updatePlayerDisplay();
    
    // Set current player
    gameState.currentPlayer = username;
    gameState.score = 0;
    gameState.currentQuestion = 0;
    
    // Update UI
    const quizUsername = document.getElementById('quizUsername');
    const currentScore = document.getElementById('currentScore');
    
    if (quizUsername) quizUsername.textContent = username;
    if (currentScore) currentScore.textContent = '0';
    
    // Show quiz screen
    showScreen('quiz');
    
    // Load first question
    loadQuestion();
}

function showScreen(screenName) {
    console.log('🔄 Showing screen:', screenName);
    
    // Hide all screens
    const screens = ['usernameScreen', 'quizScreen', 'leaderboardScreen'];
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenName + 'Screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('✅ Screen shown:', screenName);
    }
}

function loadQuestion() {
    console.log('📝 Loading question:', gameState.currentQuestion + 1);
    
    if (gameState.currentQuestion >= QUIZ_CONFIG.totalQuestions) {
        endQuiz();
        return;
    }
    
    const question = QUIZ_QUESTIONS[gameState.currentQuestion];
    const questionText = document.getElementById('questionText');
    const currentQuestion = document.getElementById('currentQuestion');
    const optionsContainer = document.getElementById('optionsContainer');
    const feedback = document.getElementById('feedback');
    
    if (currentQuestion) currentQuestion.textContent = gameState.currentQuestion + 1;
    if (questionText) questionText.textContent = question.question;
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
    
    // Clear and create options
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = function() {
                selectAnswer(index);
            };
            optionsContainer.appendChild(button);
        });
    }
    
    // Start timer
    startTimer();
}

// TIMER - FIXED
let currentTimer = null;

function startTimer() {
    // Clear any existing timer
    if (currentTimer) {
        clearInterval(currentTimer);
    }
    
    let timeLeft = QUIZ_CONFIG.timePerQuestion;
    const timeLeftEl = document.getElementById('timeLeft');
    const timerProgress = document.getElementById('timerProgress');
    
    if (timeLeftEl) timeLeftEl.textContent = `${timeLeft}s`;
    if (timerProgress) timerProgress.style.width = '100%';
    
    currentTimer = setInterval(() => {
        timeLeft--;
        if (timeLeftEl) timeLeftEl.textContent = `${timeLeft}s`;
        if (timerProgress) timerProgress.style.width = `${(timeLeft / QUIZ_CONFIG.timePerQuestion) * 100}%`;
        
        if (timeLeft <= 0) {
            clearInterval(currentTimer);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    const options = document.querySelectorAll('.option-btn');
    const question = QUIZ_QUESTIONS[gameState.currentQuestion];
    const feedback = document.getElementById('feedback');
    
    options.forEach(btn => btn.disabled = true);
    if (options[question.correct]) {
        options[question.correct].classList.add('correct');
    }
    
    if (feedback) {
        feedback.textContent = 'Time\'s up! No points.';
        feedback.className = 'feedback incorrect';
    }
    
    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 2000);
}

function selectAnswer(selectedIndex) {
    // Clear timer
    if (currentTimer) {
        clearInterval(currentTimer);
    }
    
    const question = QUIZ_QUESTIONS[gameState.currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    const currentScore = document.getElementById('currentScore');
    
    options.forEach(btn => btn.disabled = true);
    options[selectedIndex].classList.add('selected');
    
    if (selectedIndex === question.correct) {
        options[selectedIndex].classList.add('correct');
        if (feedback) {
            feedback.textContent = 'Correct! +100 XP 🎉';
            feedback.className = 'feedback correct';
        }
        
        gameState.score += QUIZ_CONFIG.xpPerQuestion;
        if (currentScore) currentScore.textContent = gameState.score;
        
        if (gameState.players.has(gameState.currentPlayer)) {
            const player = gameState.players.get(gameState.currentPlayer);
            player.score += QUIZ_CONFIG.xpPerQuestion;
            savePlayers();
        }
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        if (feedback) {
            feedback.textContent = 'Wrong! No points.';
            feedback.className = 'feedback incorrect';
        }
    }
    
    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 2000);
}

function endQuiz() {
    console.log('🏁 Quiz ended');
    showLeaderboard();
    showScreen('leaderboard');
}

function showLeaderboard() {
    cleanupOldPlayers();
    
    const playersArray = Array.from(gameState.players.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, QUIZ_CONFIG.leaderboardSize);
    
    const leaderboard = document.getElementById('leaderboard');
    if (leaderboard) {
        leaderboard.innerHTML = '';
        
        if (playersArray.length === 0) {
            leaderboard.innerHTML = '<div class="leaderboard-item"><div class="player-name">No active players</div></div>';
            return;
        }
        
        playersArray.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = `leaderboard-item ${index < 3 ? 'rank-' + (index + 1) : ''}`;
            item.innerHTML = `
                <div class="rank">#${index + 1}</div>
                <div class="player-name">${player.username}</div>
                <div class="player-score">${player.score} XP</div>
            `;
            leaderboard.appendChild(item);
        });
    }
}

// UTILITY FUNCTIONS
function cleanupOldPlayers() {
    const now = new Date();
    gameState.players.forEach((player, username) => {
        const joinedAt = new Date(player.joinedAt);
        const hoursSinceJoin = (now - joinedAt) / (1000 * 60 * 60);
        if (hoursSinceJoin >= QUIZ_CONFIG.resetHours) {
            gameState.players.delete(username);
        }
    });
    savePlayers();
}

function updatePlayerDisplay() {
    const currentPlayers = document.getElementById('currentPlayers');
    if (currentPlayers) currentPlayers.textContent = gameState.players.size;
}

function savePlayers() {
    const playersArray = Array.from(gameState.players.entries());
    localStorage.setItem('quizPlayers', JSON.stringify(playersArray));
}

function loadPlayers() {
    const saved = localStorage.getItem('quizPlayers');
    if (saved) {
        try {
            const playersArray = JSON.parse(saved);
            gameState.players = new Map(playersArray);
        } catch (e) {
            gameState.players = new Map();
        }
    }
}

function startResetTimer() {
    const resetTimer = document.getElementById('resetTimer');
    if (!resetTimer) return;
    
    function updateResetTimer() {
        const now = new Date();
        const nextReset = new Date(now);
        nextReset.setHours(now.getHours() + QUIZ_CONFIG.resetHours);
        nextReset.setMinutes(0, 0, 0);
        
        const diff = nextReset - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        resetTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateResetTimer();
    setInterval(updateResetTimer, 1000);
                                         }
