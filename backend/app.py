import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from typing import Optional
from dotenv import load_dotenv
from pydantic import BaseModel

# --- CONFIG ---
app = FastAPI()
load_dotenv()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY") 

if not api_key:
    raise ValueError("No API Key found! Check your .env file.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-3-flash-preview') 

# --- DATA MODELS ---
class UserData(BaseModel):
    chat_history: str 
    job_description: Optional[str] = None 

class RoastRequest(BaseModel):
    resume_json: str 




@app.post("/process-chat")
async def process_chat(data: UserData):
    prompt = f"""
    You are an expert Resume Writer. Read this conversation between a bot and a student:
    {data.chat_history}
    
    Task: Extract the student's details and structure them into a JSON format.
    CRITICAL: 
    1. Rewrite their simple project descriptions to sound like executive achievements (Use "Architected", "Deployed", "Optimized").
    2. If they mentioned numbers (latency, users), highlight them.
    
    Output JSON format strictly matching this structure:
    {{
        "personal_info": {{ 
            "name": "...", 
            "role": "...", 
            "email": "...", 
            "phone": "...", 
            "location": "..." 
        }},
        "about_me": "A brief 2-3 sentence professional summary highlighting passion and expertise.",
        "skills": ["..."],
        "education": [
            {{ "degree": "...", "institution": "...", "year": "...", "score": "..." }}
        ],
        "experience": [ 
            {{ "title": "...", "company": "...", "points": ["..."] }} 
        ],
        "projects": [ 
            {{ "name": "...", "tech": "...", "description": "..." }} 
        ],
        "certifications": ["..."],
        "achievements": ["..."]
    }}
    """
    response = model.generate_content(prompt)
    cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
    return {"structured_data": cleaned_text}

@app.post("/generate-portfolio")
async def generate_portfolio(data: dict):
    """
    PHASE 2: INSTANT PORTFOLIO
    Takes the JSON resume and writes a full HTML website.
    """
    resume_json = data.get("resume_data")
    theme = data.get("theme", "modern")
    
    prompt = f"""
    Act as a Senior Frontend Developer. 
    Create a Single-File HTML/Tailwind CSS Portfolio website for this student based on their data:
    {resume_json}
    
    Theme: {theme} (If 'coder', use dark mode and terminal fonts. If 'designer', use clean white space and large type).
    
    Requirements:
    - Use Tailwind CDN.
    - Include a 'Projects' gallery.
    - Include a 'Contact' section.
    - Make it responsive.
    - Output ONLY the raw HTML code. Do not use markdown blocks.
    """
    response = model.generate_content(prompt)
    cleaned_html = response.text.replace("```html", "").replace("```", "").strip()
    return {"html": cleaned_html}

@app.post("/roast-resume")
async def roast_resume(data: RoastRequest):
    """
    PHASE 3: THE ROAST MODE
    """
    prompt = f"""
    Act as a Gordon Ramsay-style Hiring Manager.
    Roast this resume JSON brutally but constructively.
    
    Resume: {data.resume_json}
    
    Tell them:
    1. What weak words they used.
    2. If their metrics are missing.
    3. If the formatting (based on data) seems weak.
    Keep it short and spicy.
    """
    response = model.generate_content(prompt)
    return {"roast": response.text}

@app.post("/coach-gap-analysis")
async def gap_analysis(data: dict):
    """
    PHASE 3: SKILL GAP
    """
    resume = data.get("resume_data")
    jd = data.get("job_description")
    
    prompt = f"""
    Compare this Resume ({resume}) against this Job Description ({jd}).
    
    Output 3 things:
    1. Match Score (0-100%).
    2. Missing Keywords (Critical skills they don't have).
    3. Action Plan (1 sentence on how to learn the missing skill).
    """
    response = model.generate_content(prompt)
    return {"analysis": response.text}

class InterviewRequest(BaseModel):
    resume_data: str
    topic: str = "general"

class AnswerEvaluation(BaseModel):
    question: str
    user_answer: str

@app.post("/interview/start")
async def start_interview(data: InterviewRequest):
    """Generates a tough interview question based on the resume."""
    prompt = f"""
    You are a Technical Interviewer. 
    Based on this resume: {data.resume_data}
    
    Generate 1 specific, technical interview question about the topic: {data.topic}.
    Keep it short (under 2 sentences) so it can be spoken easily.
    Do not ask "tell me about yourself". Ask about a specific skill or project they listed.
    """
    response = model.generate_content(prompt)
    return {"question": response.text.replace("*", "").strip()}

@app.post("/interview/evaluate")
async def evaluate_answer(data: AnswerEvaluation):
    """Rates the user's answer."""
    prompt = f"""
    Question: {data.question}
    Candidate Answer: {data.user_answer}
    
    Rate this answer (0-10) and give 1 tip to improve. 
    Keep it conversational.
    """
    response = model.generate_content(prompt)
    return {"feedback": response.text.replace("*", "").strip()}


class ATSRequest(BaseModel):
    resume_data: str
    job_description: str

@app.post("/api/ats-check")
async def ats_check(data: ATSRequest):
    """
    Industry-Grade ATS Analyzer:
    Compares the resume against a job description to give a match score, missing keywords, and fixes.
    """
    prompt = f"""
    You are an enterprise ATS (Applicant Tracking System) and Senior Technical Recruiter.
    Analyze this resume data against the provided Job Description.

    Resume Data: {data.resume_data}
    Job Description: {data.job_description}

    Provide a thorough breakdown using clean HTML/Markdown format:
    1. **ATS Match Score**: A definitive percentage score (0-100%).
    2. **Keyword Match Analysis**: Critical keywords found vs. missing keywords required by the job description.
    3. **Formatting & Structure Critique**: Check if standard headings and required contact/skills info are present.
    4. **Top 3 High-Impact Fixes**: Specific advice on how to rewrite or re-align bullet points for this specific role.
    """
    
    try:
        response = model.generate_content(prompt)
        return {"ats_report": response.text.replace("*", "").strip()}
    except Exception as e:
        return {"ats_report": f"Error generating ATS report: {str(e)}"}