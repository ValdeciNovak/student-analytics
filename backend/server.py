from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "dashboard_estudantes.json")

@app.get("/alunos")
async def get_alunos():
    if not os.path.exists(JSON_PATH):
        raise HTTPException(
            status_code=404,
            detail="JSON não encontrado. Rode o main.py primeiro para gerar os dados."
        )

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)