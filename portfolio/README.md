# ⚔ Warrior Portfolio — Customization Guide

A cinematic, story-based warrior-themed portfolio with **Three.js 3D visuals**, animated particles, glassmorphism panels, and full responsiveness.

---

## 🗂 File Structure
```
portfolio/
├── index.html    ← All sections & content placeholders
├── style.css     ← Full design system, animations, responsive layout
├── main.js       ← Three.js 3D scene + all JS interactions
└── README.md     ← This guide
```

---

## ✏️ How to Customize

### 1. Your Identity (index.html)
Search and replace these placeholders:

| Placeholder | Replace With |
|---|---|
| `[ YOUR NAME ]` | Your full name |
| `[ YOUR TITLE ]` | e.g. "Full Stack Developer & UI Architect" |
| `[ YOUR CITY / COUNTRY ]` | e.g. "Bangalore, India" |
| `[ YOUR ROLE ]` | e.g. "developer", "designer" |
| `[ YOUR STORY ]` | 2–3 paragraphs about yourself |
| `[ YOUR INTERESTS / HOBBIES ]` | e.g. "music, chess, hiking" |
| `[YOUR_EMAIL@example.com]` | your@email.com |
| `[YOUR_GITHUB_URL]` | https://github.com/yourname |
| `[YOUR_LINKEDIN_URL]` | https://linkedin.com/in/yourname |
| `[YOUR_TWITTER_URL]` | https://twitter.com/yourname |
| `[YOUR_RESUME_PDF_PATH]` | Path or URL to your resume PDF |

### 2. Stats (About section)
Find `data-target="[X]"` and replace `[X]` with your actual numbers:
```html
<span class="stat-num" data-target="25">0</span>   <!-- 25 projects -->
<span class="stat-num" data-target="3">0</span>    <!-- 3 years -->
<span class="stat-num" data-target="15">0</span>   <!-- 15 technologies -->
<span class="stat-num" data-target="10">0</span>   <!-- 10 clients -->
```

### 3. Your Photo
Replace the `src` in the portrait `<img>` tag:
```html
<img src="assets/your-photo.jpg" alt="Your Name" class="portrait-img" />
```
> Place your photo in a `portfolio/assets/` folder.

### 4. Skills
Update the skill names, percentages and `data-width` values:
```html
<span class="skill-name">React</span>
<span class="skill-percent">90%</span>
<div class="skill-fill" data-width="90"></div>
```

### 5. Projects
For each project card, replace:
- `[PROJECT_N_IMAGE]` — path/URL to screenshot
- `[Project N Name]` — project title
- `[ Describe... ]` — your description
- `[PROJECT_N_LIVE_URL]` — live demo URL
- `[PROJECT_N_GITHUB_URL]` — GitHub repo URL
- `data-category` — `"web"`, `"mobile"`, `"design"`, or `"other"`

### 6. Experience / Timeline
Update each `.timeline-item` with your real job/education history.

### 7. Colors (style.css — `:root`)
```css
--gold:  #c9a84c;   /* Primary accent */
--ember: #e8622a;   /* Secondary accent */
--deep:  #0a090d;   /* Page background */
```

---

## 📬 Contact Form
The form currently simulates sending. To make it real:

**Option A — Formspree (easiest):**
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

**Option B — EmailJS:**
```js
emailjs.send('service_id', 'template_id', formData);
```

---

## 🚀 Deploying

### GitHub Pages
```bash
git init && git add . && git commit -m "warrior portfolio launch"
git remote add origin https://github.com/yourname/portfolio.git
git push -u origin main
# Enable GitHub Pages in repo Settings → Pages
```

### Netlify
Drag the `portfolio/` folder to [netlify.com](https://netlify.com) — live in seconds!

---

## 🎨 Color Reference
| Variable | Hex | Use |
|---|---|---|
| `--gold` | #c9a84c | Primary accents |
| `--gold-light` | #e8c87a | Hover states |
| `--ember` | #e8622a | Featured elements |
| `--deep` | #0a090d | Page background |
| `--panel` | rgba(30,27,46,0.7) | Card backgrounds |
