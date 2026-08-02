# AI-Based Smart Waste Segregation and Recycling Assistant

**Team Name:** Brain Crackers  
**Problem ID:** ISTE-EN01  
**Track:** Project  
**Category:** Waste Management | Sustainable Future  
**Event:** ISTE Hackathon 2026 (Easwari Engineering College)  

---

## 📌 Problem Statement
Household waste is frequently disposed of incorrectly because citizens struggle to identify whether items are recyclable, compostable, e-waste, or general waste. This issue leads to:
* Contamination of recyclable waste streams.
* Reduced material recovery rates.
* Unnecessary overload in municipal landfills.
* Lack of real-time disposal instructions and environmental awareness.

---

## 💡 Proposed Solution
The **AI-Based Smart Waste Segregation and Recycling Assistant** is an accessible platform designed to help citizens make informed waste-disposal decisions[cite: 1]. By uploading an image or using a device camera, users receive instant waste categorization, tailored disposal guidance, pre-disposal preparation steps, and real-time environmental impact metrics[cite: 1].

---

## ✨ Key Features
* **AI-Based Waste Identification:** Analyzes waste images directly via camera, file upload, or drag-and-drop input[cite: 1].
* **Smart Segregation & Guidance:** Recommends the exact bin category or specialized drop-off method along with necessary item preparation instructions[cite: 1].
* **Environmental Metrics:** Displays estimated decomposition times and potential CO₂ savings per item[cite: 1].
* **Eco Dashboard:** Tracks total scans, category distributions, and cumulative CO₂ reductions[cite: 1].
* **Recycling Assistant:** An integrated chatbot answering FAQs on tricky items (e.g., batteries, plastic bags, pizza boxes, styrofoam, broken glass)[cite: 1].

---

## 🛠️ System Architecture & Workflow

1. **User Input:** Image captured via device camera or local upload[cite: 1].
2. **Pre-processing:** Image is resized to $128\times128$ pixels for fast feature extraction[cite: 1].
3. **Feature Extraction:** Client-side classifier extracts hue, brightness, saturation, edge density, and reflectivity[cite: 1].
4. **Classification & Scoring:** Evaluates weighted likelihoods for plastic, paper/cardboard, glass, metal, organic, and e-waste[cite: 1]. Low confidence defaults to general waste[cite: 1].
5. **Output & Guidance:** Displays predicted category, confidence score, and preparation steps[cite: 1].
6. **Impact Tracking:** Updates the Eco Dashboard with cumulative environmental metrics[cite: 1].

---

## 🚀 Technology Stack
* **Frontend:** HTML, CSS, JavaScript / React, TypeScript, Tailwind CSS[cite: 1]
* **Classification Pipeline:** JavaScript / Canvas API (Client-side feature extraction & rule-based scoring)[cite: 1]
* **Package Manager:** Bun / npm

---

## ⚡ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/dhanueec29/ISTE---EN01---BRAIN-CRACKERS.git](https://github.com/dhanueec29/ISTE---EN01---BRAIN-CRACKERS.git)
   cd ISTE---EN01---BRAIN-CRACKERS
