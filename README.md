# Tarot Reading App

## Overview
A lightweight web-based tarot reading application that generates personalized interpretations using AI.

This project combines a simple front-end interface with a serverless backend built on Google Apps Script, allowing users to draw cards and receive reflective, narrative-style readings in real time.

It is designed as an experimental MVP exploring how symbolic systems (tarot) can be translated into structured prompts and interpreted through language models.

---

## What This Project Does
- Simulates a tarot card draw experience  
- Translates user input and card selection into a structured prompt  
- Sends the prompt to an AI model via API  
- Returns a narrative tarot reading  
- Displays the result in a clean interface  

---

## Core Features
- **AI-generated readings**: Context-aware interpretations based on user input  
- **Serverless backend**: Built using Google Apps Script  
- **Simple frontend**: Static HTML/CSS/JS hosted via GitHub Pages  
- **Custom prompt logic**: Structured tarot interpretation framework  

---

## How It Works

### 1. User Input
User provides context (e.g., situation, question, emotional state)

### 2. Card Selection
Cards are drawn (randomized or user-selected)

### 3. Prompt Construction
Backend builds a structured tarot prompt:
- Card meanings  
- Card positions (past, present, future, etc.)  
- User context  

### 4. AI Processing
Request sent to OpenAI API → returns generated interpretation  

### 5. Output
Reading is displayed as a narrative response  

---

## Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- Hosted on GitHub Pages  

### Backend
- Google Apps Script  
- OpenAI API  
