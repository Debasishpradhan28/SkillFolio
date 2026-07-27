let chatHistory = [];
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
// --- STATE ---
let currentTemplate = 'modern';
let generatedResumeData = null;

// --- DEMO DATA (Placeholder so the app isn't empty) ---
const dummyData = {
    personal_info: {
        name: "John Doe",
        role: "Full Stack Developer",
        contact: "john.doe@example.com | 123-456-7890"
    },
    about_me: "Motivated Computer Science Engineering student specialized in building high-performance full-stack web applications and AI-driven workflow integrations.",
    skills: ["React.js", "Node.js", "Python", "AWS", "Tailwind CSS", "MongoDB"],
    education: [
        {
            degree: "B.Tech in Computer Science and Engineering",
            institution: "Veer Surendra Sai University of Technology (VSSUT)",
            year: "2024 - 2028",
            score: "CGPA: 8.5+"
        }
    ],
    experience: [
        {
            title: "Senior Developer",
            company: "Tech Solutions Inc.",
            points: [
                "Led a team of 5 developers to build a CRM dashboard.",
                "Optimized API latency by 40% using Redis caching.",
                "Implemented CI/CD pipelines reducing deployment time."
            ]
        },
        {
            title: "Junior Developer",
            company: "Startup Hub",
            points: [
                "Developed responsive UI components using React.",
                "Collaborated with UX designers to improve accessibility."
            ]
        }
    ],
    projects: [
        {
            name: "E-Commerce Platform",
            tech: "MERN Stack",
            description: "A full-featured shopping platform with Stripe payments and real-time inventory management."
        },
        {
            name: "AI Chatbot",
            tech: "Python, OpenAI",
            description: "Integrated GPT-4 API to create a customer support assistant."
        }
    ],
    certifications: [
        "AI/ML Engineering Certificate - IBM SkillsBuild",
        "Cybersecurity Internship Certificate - VOIS"
    ],
    achievements: [
        "Selected for institutional leadership and technical hackathon team collaborations."
    ]
};

// --- TEMPLATE LIBRARY ---
const templates = {
    modern: (data) => `
        <div style="font-family: 'Inter', sans-serif; color: #334155; padding: 40px; background: #ffffff; width: 794px; box-sizing: border-box;">
            <!-- Header -->
            <div style="border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 25px;">
                <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1.1; text-transform: uppercase;">${data.personal_info?.name || ''}</h1>
                <p style="font-size: 16px; color: #2563eb; font-weight: 600; margin-top: 4px;">${data.personal_info?.role || ''}</p>
                <p style="font-size: 11px; color: #64748b; margin-top: 6px;">
                    📧 ${data.personal_info?.email || ''} | 📱 ${data.personal_info?.phone || ''} | 📍 ${data.personal_info?.location || ''}
                </p>
            </div>

            <!-- About Me -->
            ${data.about_me ? `
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">About Me</h3>
                <p style="font-size: 12px; color: #475569; line-height: 1.5;">${data.about_me}</p>
            </div>` : ''}

            <!-- Skills -->
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">Technical Skills</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${(data.skills || []).map(s => `<span style="background: #eff6ff; color: #1d4ed8; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 600;">${s}</span>`).join('')}
                </div>
            </div>

            <!-- Education -->
            ${data.education && data.education.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">Education</h3>
                ${data.education.map(edu => `
                    <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 12px;">
                        <div><b>${edu.degree}</b> — ${edu.institution}</div>
                        <div style="color: #64748b;">${edu.year} (${edu.score || ''})</div>
                    </div>
                `).join('')}
            </div>` : ''}

            <!-- Experience -->
            ${data.experience && data.experience.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">Experience</h3>
                ${data.experience.map(exp => `
                    <div style="margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; color: #1e293b;">
                            <span>${exp.title}</span><span style="color: #2563eb;">${exp.company}</span>
                        </div>
                        <ul style="margin: 4px 0 0 16px; font-size: 12px; color: #475569; line-height: 1.4;">
                            ${(exp.points || []).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>` : ''}

            <!-- Projects -->
            ${data.projects && data.projects.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">Projects</h3>
                ${data.projects.map(proj => `
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: 700; font-size: 13px; color: #1e293b;">${proj.name} <span style="font-weight: 400; color: #2563eb; font-size: 11px;">// ${proj.tech}</span></div>
                        <p style="font-size: 12px; color: #475569; margin-top: 2px; line-height: 1.4;">${proj.description}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            <!-- Certifications & Achievements -->
            <div style="display: flex; gap: 20px;">
                ${data.certifications && data.certifications.length > 0 ? `
                <div style="flex: 1;">
                    <h3 style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">Certifications</h3>
                    <ul style="margin: 0 0 0 14px; font-size: 11px; color: #475569; line-height: 1.4;">
                        ${data.certifications.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>` : ''}
                ${data.achievements && data.achievements.length > 0 ? `
                <div style="flex: 1;">
                    <h3 style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">Achievements</h3>
                    <ul style="margin: 0 0 0 14px; font-size: 11px; color: #475569; line-height: 1.4;">
                        ${data.achievements.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>
        </div>
    `,

    // NEW EXECUTIVE MINAL TEMPLATE (Replaced Harvard)
    executive: (data) => `
        <div style="font-family: 'Times New Roman', serif; color: #111827; padding: 45px; background: #ffffff; width: 794px; box-sizing: border-box; line-height: 1.4;">
            <div style="text-align: center; border-bottom: 2px solid #111827; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">${data.personal_info?.name || ''}</h1>
                <p style="font-size: 13px; font-style: italic; margin-top: 4px; color: #374151;">${data.personal_info?.role || ''}</p>
                <p style="font-size: 11px; margin-top: 4px; color: #4b5563;">
                    ${data.personal_info?.email || ''} | ${data.personal_info?.phone || ''} | ${data.personal_info?.location || ''}
                </p>
            </div>

            ${data.about_me ? `
            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #9ca3af; padding-bottom: 2px; margin-bottom: 5px; letter-spacing: 0.5px;">Executive Summary</h3>
                <p style="font-size: 12px; text-align: justify; margin: 0;">${data.about_me}</p>
            </div>` : ''}

            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #9ca3af; padding-bottom: 2px; margin-bottom: 5px; letter-spacing: 0.5px;">Core Expertise</h3>
                <p style="font-size: 12px; margin: 0;">${(data.skills || []).join(" • ")}</p>
            </div>

            ${data.experience && data.experience.length > 0 ? `
            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #9ca3af; padding-bottom: 2px; margin-bottom: 8px; letter-spacing: 0.5px;">Professional Experience</h3>
                ${data.experience.map(exp => `
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
                            <span>${exp.title} — ${exp.company}</span>
                        </div>
                        <ul style="margin: 3px 0 0 15px; font-size: 11.5px; padding: 0;">
                            ${(exp.points || []).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>` : ''}

            ${data.projects && data.projects.length > 0 ? `
            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #9ca3af; padding-bottom: 2px; margin-bottom: 8px; letter-spacing: 0.5px;">Key Projects</h3>
                ${data.projects.map(proj => `
                    <div style="margin-bottom: 8px;">
                        <div style="font-size: 12px; font-weight: bold;">${proj.name} <span style="font-weight: normal; font-style: italic;">(${proj.tech})</span></div>
                        <p style="font-size: 11.5px; margin: 2px 0 0 0;">${proj.description}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            ${data.education && data.education.length > 0 ? `
            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #9ca3af; padding-bottom: 2px; margin-bottom: 6px; letter-spacing: 0.5px;">Education</h3>
                ${data.education.map(edu => `
                    <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
                        <div><b>${edu.degree}</b>, ${edu.institution}</div>
                        <div>${edu.year}</div>
                    </div>
                `).join('')}
            </div>` : ''}

            <div style="display: flex; gap: 20px;">
                ${data.certifications && data.certifications.length > 0 ? `
                <div style="flex: 1;">
                    <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #9ca3af; padding-bottom: 2px; margin-bottom: 5px;">Certifications</h3>
                    <ul style="margin: 0 0 0 14px; font-size: 11px; padding: 0;">
                        ${data.certifications.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>` : ''}
                ${data.achievements && data.achievements.length > 0 ? `
                <div style="flex: 1;">
                    <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #9ca3af; padding-bottom: 2px; margin-bottom: 5px;">Achievements</h3>
                    <ul style="margin: 0 0 0 14px; font-size: 11px; padding: 0;">
                        ${data.achievements.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>
        </div>
    `,

    // CREATIVE TEMPLATE
    creative: (data) => `
        <div style="font-family: 'Inter', sans-serif; display: flex; width: 794px; min-height: 1123px; background: #ffffff; box-sizing: border-box;">
            <!-- Left Sidebar -->
            <div style="width: 35%; background: #0f172a; color: white; padding: 40px 25px; box-sizing: border-box;">
                <h1 style="font-size: 26px; font-weight: 700; line-height: 1.1; margin-bottom: 5px;">${data.personal_info?.name || ''}</h1>
                <p style="font-size: 13px; color: #a78bfa; font-weight: 600; margin-bottom: 30px;">${data.personal_info?.role || ''}</p>
                
                <div style="margin-bottom: 30px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 10px; color: #a78bfa;">Contact</div>
                    <p style="font-size: 11px; line-height: 1.5; color: #cbd5e1; margin: 0; word-break: break-all;">
                        📧 ${data.personal_info?.email || ''}<br>
                        📱 ${data.personal_info?.phone || ''}<br>
                        📍 ${data.personal_info?.location || ''}
                    </p>
                </div>

                <div style="margin-bottom: 30px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 10px; color: #a78bfa;">Skills</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                         ${(data.skills || []).map(s => `<span style="background: #1e293b; border: 1px solid #475569; padding: 3px 8px; font-size: 10px; border-radius: 4px; color: #e2e8f0;">${s}</span>`).join('')}
                    </div>
                </div>

                ${data.certifications && data.certifications.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 10px; color: #a78bfa;">Certifications</div>
                    <ul style="margin: 0 0 0 14px; font-size: 10.5px; color: #cbd5e1; padding: 0; line-height: 1.4;">
                        ${data.certifications.map(c => `<li style="margin-bottom: 4px;">${c}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>

            <!-- Right Main Content Area -->
            <div style="width: 65%; padding: 40px 30px; color: #334155; box-sizing: border-box;">
                ${data.about_me ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><span style="display:block; width: 6px; height: 16px; background: #a78bfa;"></span> About Me</h3>
                    <p style="font-size: 12px; line-height: 1.5; color: #475569; margin: 0;">${data.about_me}</p>
                </div>` : ''}

                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"><span style="display:block; width: 6px; height: 16px; background: #a78bfa;"></span> Experience</h3>
                     ${(data.experience || []).map(exp => `
                        <div style="margin-bottom: 15px;">
                            <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0;">${exp.title}</h4>
                            <p style="font-size: 11px; color: #7c3aed; font-weight: 600; margin: 2px 0 4px 0;">${exp.company}</p>
                            <ul style="font-size: 11.5px; line-height: 1.4; color: #475569; margin: 0 0 0 14px; padding: 0;">
                                ${(exp.points || []).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"><span style="display:block; width: 6px; height: 16px; background: #0f172a;"></span> Projects</h3>
                     ${(data.projects || []).map(p => `
                        <div style="margin-bottom: 12px;">
                            <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${p.name} <span style="font-weight: 400; font-size: 11px; color: #7c3aed;">(${p.tech})</span></div>
                            <p style="font-size: 11.5px; line-height: 1.4; color: #475569; margin: 2px 0 0 0;">${p.description}</p>
                        </div>
                    `).join('')}
                </div>

                ${data.education && data.education.length > 0 ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"><span style="display:block; width: 6px; height: 16px; background: #0f172a;"></span> Education</h3>
                    ${data.education.map(edu => `
                        <div style="margin-bottom: 8px; font-size: 11.5px;">
                            <div style="font-weight: 700; color: #0f172a;">${edu.degree}</div>
                            <div style="color: #475569;">${edu.institution} (${edu.year})</div>
                        </div>
                    `).join('')}
                </div>` : ''}

                ${data.achievements && data.achievements.length > 0 ? `
                <div>
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;"><span style="display:block; width: 6px; height: 16px; background: #7c3aed;"></span> Achievements</h3>
                    <ul style="margin: 0 0 0 14px; font-size: 11px; color: #475569; padding: 0; line-height: 1.4;">
                        ${data.achievements.map(a => `<li style="margin-bottom: 3px;">${a}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>
        </div>
    `
};

// --- LOGIC ---

function changeTemplate(tmplName) {
    // 1. Set Template Name
    currentTemplate = tmplName;
    
    // 2. Update UI Buttons (Visual selection state)
    document.querySelectorAll('.template-selector').forEach(btn => {
        const badge = btn.querySelector('.active-badge');
        const container = btn.querySelector('div:first-child');
        
        if (badge) badge.classList.add('hidden');
        if (container) {
            container.classList.remove('ring-2', 'ring-blue-500', 'border-blue-400');
            container.classList.add('border-slate-200');
        }
    });

    const activeBtn = document.getElementById(`btn-${tmplName}`);
    if(activeBtn) {
        const badge = activeBtn.querySelector('.active-badge');
        const container = activeBtn.querySelector('div:first-child');
        if (badge) badge.classList.remove('hidden');
        if (container) container.classList.add('ring-2', 'ring-blue-500', 'border-blue-400');
    }

    // 3. Render (Using Data OR Dummy Data)
    renderResumePreview();
}

function renderResumePreview() {
    const container = document.getElementById('resume-preview');
    
    // Safety check: ensure generatedResumeData is parsed from a JSON string if needed
    let dataToUse = generatedResumeData || dummyData;
    if (typeof dataToUse === 'string') {
        try {
            dataToUse = JSON.parse(dataToUse);
        } catch (e) {
            console.error("Failed to parse resume JSON:", e);
            dataToUse = dummyData;
        }
    }

    // Render using your defined template functions safely
    if (templates[currentTemplate]) {
        container.innerHTML = templates[currentTemplate](dataToUse);
    } else {
        container.innerHTML = templates['modern'](dataToUse);
    }

    // Add QR Code safely
    const qrTarget = container.querySelector("#qr-target");
    if(qrTarget) {
        qrTarget.innerHTML = "";
        try {
            new QRCode(qrTarget, {
                text: "https://skillfolio.onrender.com", 
                width: 64,
                height: 64,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        } catch (e) { console.log("QR Code skipped"); }
    }
}

async function triggerRoastWorkflow() {
    const roastContainer = document.getElementById('roast-container');
    roastContainer.classList.remove('hidden');
    document.getElementById('roast-content').innerHTML = "🔥 Analyzing resume weaknesses and tone...";
    
    let dataToUse = generatedResumeData || dummyData;
    if (typeof dataToUse === 'string') {
        try { dataToUse = JSON.parse(dataToUse); } catch (e) {}
    }

    try {
        const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/roast-resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume_json: JSON.stringify(dataToUse) })
        });
        const data = await response.json();
        document.getElementById('roast-content').innerHTML = data.roast.replace(/\n/g, '<br>');
    } catch (err) {
        document.getElementById('roast-content').innerHTML = "Could not connect to AI roast service.";
    }
}

function closeRoastBox() {
    document.getElementById('roast-container').classList.add('hidden');
}

function proceedToTemplates() {
    document.getElementById('roast-container').classList.add('hidden');
    // Scroll or focus smoothly down to template selection or preview
    renderResumePreview();
}

async function downloadPDF() {
    let dataToUse = generatedResumeData || dummyData;
    if (typeof dataToUse === 'string') {
        try { dataToUse = JSON.parse(dataToUse); } catch (e) { dataToUse = dummyData; }
    }
    
    const name = dataToUse.personal_info?.name || "Resume";
    const element = document.getElementById('resume-preview');
    
    const opt = {
        margin:       0,
        filename:     `${name.replace(/\s+/g, "_")}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily clone and normalize the preview container for clean PDF export
    const clone = element.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.width = '794px';
    clone.style.minHeight = '1123px';
    
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
        await html2pdf().from(clone).set(opt).save();
    } catch(err) {
        alert("PDF Export Error: " + err.message);
    } finally {
        document.body.removeChild(wrapper);
    }
}

// Update responsive scaling
window.addEventListener('resize', handleResize);
function handleResize() {
    const preview = document.getElementById('resume-preview');
    if(preview) {
        const width = window.innerWidth;
        let scale = width < 768 ? 0.4 : 0.85; 
        preview.style.transform = `scale(${scale})`;
    }
}

// --- INITIALIZE ---
// Run this on load so the resume isn't blank!
renderResumePreview();
function setTheme(theme) {
    selectedTheme = theme;
    alert(`Theme set to: ${theme}`);
}
// Automatically load the studio resume into the ATS box when switching to the ATS page or clicking sync
function loadGeneratedResumeIntoATS() {
    let dataToUse = generatedResumeData || dummyData;
    if (typeof dataToUse === 'string') {
        try { dataToUse = JSON.parse(dataToUse); } catch (e) { dataToUse = dummyData; }
    }
    
    // Flatten JSON object into clean readable text for the ATS parser textarea
    const formattedText = `
Name: ${dataToUse.personal_info?.name || ''}
Role: ${dataToUse.personal_info?.role || ''}
Email: ${dataToUse.personal_info?.email || ''} | Phone: ${dataToUse.personal_info?.phone || ''}

Summary: ${dataToUse.about_me || ''}

Skills: ${(dataToUse.skills || []).join(', ')}

Experience:
${(dataToUse.experience || []).map(e => `- ${e.title} at ${e.company}: ${e.points ? e.points.join(' ') : ''}`).join('\n')}

Projects:
${(dataToUse.projects || []).map(p => `- ${p.name} (${p.tech}): ${p.description}`).join('\n')}

Certifications: ${(dataToUse.certifications || []).join(', ')}
    `.trim();

    const resumeInput = document.getElementById('ats-resume-input');
    if (resumeInput) {
        resumeInput.value = formattedText;
    }
}

async function runATSCheck() {
    const resumeText = document.getElementById('ats-resume-input').value.trim();
    const jd = document.getElementById('ats-job-description').value.trim();
    const resultsContainer = document.getElementById('ats-results-container');
    const contentDiv = document.getElementById('ats-content');

    if (!resumeText) {
        alert("Please provide or sync your resume content first!");
        return;
    }
    if (!jd) {
        alert("Please paste a target job description!");
        return;
    }

    resultsContainer.classList.remove('hidden');
    contentDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center py-8 space-y-3">
            <div class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs text-slate-400 font-mono">Parsing resume text vectors against job requirements...</p>
        </div>
    `;

    try {
        const response = await fetch("https://skillfolio-backend-9vmd.onrender.com/api/ats-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                resume_data: resumeText,
                job_description: jd
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server returned status ${response.status} (Make sure backend is updated with /api/ats-check)`);
        }

        const data = await response.json();
        contentDiv.innerHTML = data.ats_report.replace(/\n/g, '<br>');
    } catch (err) {
        contentDiv.innerHTML = `<p class="text-red-400 font-mono text-xs">Error: ${err.message}</p>`;
    }
}

// Hook it into your showPage function so it auto-syncs when you open the ATS tab
const oldShowPage = window.showPage;
window.showPage = function(pageId) {
    if (typeof oldShowPage === 'function') oldShowPage(pageId);
    if (pageId === 'ats') {
        loadGeneratedResumeIntoATS();
    }
};
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
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendMessage(); 
    }
});