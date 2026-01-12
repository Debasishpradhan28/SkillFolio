let chatHistory = [];
let generatedResumeData = null; 
let selectedTheme = 'coder';


function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('bg-blue-600', 'text-white'));
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
}


function addMessage(text, isUser = false) {
    const chatWindow = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`;
    
    div.innerHTML = `
        <div class="w-8 h-8 rounded-full ${isUser ? 'bg-slate-800' : 'bg-blue-100'} flex items-center justify-center ${isUser ? 'text-white' : 'text-blue-600'}">
            <i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="${isUser ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'} p-3 rounded-2xl ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} text-sm max-w-[80%]">
            ${text}
        </div>
    `;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    chatHistory.push(`${isUser ? 'Student' : 'Bot'}: ${text}`);
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value;
    if (!text) return;
    
    addMessage(text, true);
    input.value = '';

    
    setTimeout(() => {
        const lastUserMsg = chatHistory[chatHistory.length - 1].toLowerCase();
        let botReply = "Got it. Tell me about another project or skill.";
        
        if (chatHistory.length < 3) botReply = "Great. Now list your top 3 technical skills.";
        else if (chatHistory.length < 5) botReply = "Okay. Describe your most complex project. What was the hardest bug you fixed?";
        else if (lastUserMsg.includes("done") || lastUserMsg.includes("finish")) botReply = "Awesome. Click the 'Finish & Generate' button below!";
        
        addMessage(botReply, false);
    }, 800);
}


async function finalizeResume() {
    addMessage("Analyzing your data and rewriting for ATS...", false);
    
    try {
        const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/process-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_history: chatHistory.join("\n") })
        });
        const data = await response.json();
        
    
        generatedResumeData = data.structured_data;
        
        document.getElementById('resume-preview').textContent = generatedResumeData;
        showPage('preview');
        
    } catch (err) {
        alert("Error connecting to AI Backend");
    }
}

async function roastMyResume() {
    if (!generatedResumeData) return alert("Generate resume first!");
    
    const roastBox = document.getElementById('roast-box');
    roastBox.classList.remove('hidden');
    document.getElementById('roast-content').innerHTML = "🔥 Roasting in progress...";
    
    const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/roast-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_json: JSON.stringify(generatedResumeData) })
    });
    const data = await response.json();
    document.getElementById('roast-content').innerText = data.roast;
}

function setTheme(theme) {
    selectedTheme = theme;
    alert(`Theme set to: ${theme}`);
}

async function generateWebsite() {
    if (!generatedResumeData) return alert("Generate resume first!");
    
    const loader = document.getElementById('portfolio-loader');
    loader.classList.remove('hidden');
    
    const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/generate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            resume_data: JSON.stringify(generatedResumeData),
            theme: selectedTheme
        })
    });
    const data = await response.json();
    
    loader.classList.add('hidden');
    
    const frame = document.getElementById('portfolio-frame');
    frame.contentWindow.document.open();
    frame.contentWindow.document.write(data.html);
    frame.contentWindow.document.close();
}

async function analyzeGap() {
    if (!generatedResumeData) return alert("Generate resume first!");
    const jd = document.getElementById('job-description').value;
    if (!jd) return alert("Paste a JD first!");
    
    const resultsArea = document.getElementById('coach-results');
    resultsArea.classList.remove('hidden');
    document.getElementById('coach-content').innerHTML = "🧠 Analyzing gap...";
    
    const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/coach-gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            resume_data: JSON.stringify(generatedResumeData),
            job_description: jd
        })
    });
    const data = await response.json();
    document.getElementById('coach-content').innerHTML = data.analysis.replace(/\n/g, "<br>");
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function startListening() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser doesn't support speech recognition. Use Chrome!");
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    const btn = document.getElementById('mic-btn');
    const input = document.getElementById('interview-answer');

    btn.innerHTML = '<i class="fa-solid fa-circle-dot animate-pulse text-red-500"></i> Listening...';
    
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Speak Answer';
    };

    recognition.onerror = () => {
        btn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Error';
    };
}

let currentQuestion = "";

async function startMockInterview() {
    if (!generatedResumeData) return alert("Please generate your resume first so I know what to ask!");

    const area = document.getElementById('coach-results');
    area.classList.remove('hidden');
    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl border border-blue-200 text-center space-y-4">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 text-2xl">
                <i class="fa-solid fa-user-tie"></i>
            </div>
            <h3 id="ai-question" class="text-xl font-bold text-slate-800">Connecting to Interviewer...</h3>
            
            <div class="flex gap-2 justify-center">
                <button onclick="startListening()" id="mic-btn" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-microphone"></i> Speak Answer
                </button>
            </div>
            
            <textarea id="interview-answer" class="w-full border p-2 rounded" placeholder="Or type your answer here..."></textarea>
            
            <button onclick="submitAnswer()" class="w-full bg-blue-600 text-white py-2 rounded font-bold">Submit Answer</button>
            
            <div id="interview-feedback" class="text-left text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded hidden"></div>
        </div>
    `;

    const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            resume_data: JSON.stringify(generatedResumeData),
            topic: "technical skills"
        })
    });
    
    const data = await response.json();
    currentQuestion = data.question;
 
    document.getElementById('ai-question').innerText = currentQuestion;
    speakText(currentQuestion);
}

async function submitAnswer() {
    const userAnswer = document.getElementById('interview-answer').value;
    const feedbackBox = document.getElementById('interview-feedback');
    
    feedbackBox.classList.remove('hidden');
    feedbackBox.innerHTML = "🤔 Evaluating...";
    
    const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            question: currentQuestion,
            user_answer: userAnswer
        })
    });
    
    const data = await response.json();
    feedbackBox.innerHTML = `<b>Feedback:</b> ${data.feedback}`;
}