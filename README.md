## SkillFolio.ai - The AI Career Copilot

## 🌟 The Problem
Students often struggle to articulate their achievements. They have the skills, but their resumes look generic, and they lack an online presence.
* **Resume Writers** are expensive.
* **Website Builders** are too complex.
* **ATS Systems** reject good candidates due to bad formatting.

## 💡 Our Solution
SkillFolio uses **Google Gemini AI** to interview the student, extract their hidden skills, and generate:
1.  **ATS-Optimized Resumes** (Harvard & Creative Styles).
2.  **Instant Personal Websites** (Deployed in seconds).
3.  **Real-time Career Coaching** (Mock Interviews & Roast Mode).

## ✨ Key Features

### 1. 🤖 The Experience Alchemist (Chat-to-Resume)
Stop filling out boring forms. Just chat with our AI agent.
* **Input:** "I built a weather app using React."
* **AI Output:** "Architected a real-time meteorological dashboard using React.js, reducing API latency by 40%."

<img width="1730" height="870" alt="image" src="https://github.com/user-attachments/assets/9b1b57f1-0dfa-423a-a4fb-0d65b2780d4f" />

### 2. 🎨 Smart Resume Engine
* **Multi-Template Support:** Choose between *Harvard Professional*, *Modern Tech*, or *Creative Sidebar*.
* **Smart PDF:** Auto-embeds a QR code linking directly to your portfolio website.
* **Roast Mode:** Get brutal, honest feedback from an AI Hiring Manager (Gordon Ramsay style).

<img width="1870" height="885" alt="image" src="https://github.com/user-attachments/assets/861a5606-67c5-4e1a-b055-50d4a3eac84f" />

### 3. 🌐 Instant Portfolio Generator
Turn your resume into a live website with one click.
* **Themes:** Switch between "Hacker Terminal" (for coders) and "Clean Studio" (for designers).
* **Mobile Responsive:** Looks great on phones and desktops.

<img width="1865" height="886" alt="image" src="https://github.com/user-attachments/assets/c38389ab-e10b-412f-b2a4-c64d99bc4e8a" />

### 4. 🎤 AI Career Coach
* **Gap Analysis:** Paste a Job Description, and the AI tells you what skills you are missing.
* **Mock Interview:** The browser speaks a technical question, listens to your answer, and grades you instantly.


<img width="1703" height="899" alt="image" src="https://github.com/user-attachments/assets/049be36c-1339-42f2-a4ae-4f7b208ed8f1" />


## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (No heavy frameworks).
* **Backend:** Python, FastAPI.
* **AI Model:** Google Gemini 1.5 Flash (via `google-generativeai`).
* **PDF Generation:** `html2pdf.js` + `qrcode.js`.
* **Deployment:** Render (Backend & Frontend).

## 🚀 Installation & Setup

Follow these steps to run SkillFolio locally.

### Prerequisites
* Python 3.9+
* A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/skillfolio-ai.git](https://github.com/yourusername/skillfolio-ai.git)
cd skillfolio-ai
```
2. Backend Setup
Navigate to the backend folder and install dependencies.
```bash
cd backend
pip install -r requirements.txt
```
Create a .env file in the backend/ folder:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```
Run the server 
```bash
uvicorn app:app --reload
```
Server will start at http://127.0.0.1:8000

3. Frontend Setup
Open a new terminal, go to the frontend folder, and start a simple server.
```bash
cd ../frontend
python -m http.server 3000
```
Open http://localhost:3000 in your browser.


🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

Deployed link - https://skillfolio-frontend.onrender.com

Made with ❤️ by [Debasish Pradhan]



