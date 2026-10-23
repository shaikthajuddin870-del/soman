const lessons=[
['01','Variables','Python Basics','Store values using meaningful names.','introduction-to-python'],
['02','Data Types','Python Basics','Understand strings, integers, floats, booleans and collections.','data-types'],
['03','Input & Output','Python Basics','Read user input and display useful output.','input-output'],
['04','Operators','Python Basics','Use arithmetic, comparison, logical and assignment operators.','operators'],
['05','Conditional Statements','Python Basics','Make decisions with if, elif and else.','conditional-statements'],
['06','Loops','Python Basics','Repeat tasks with for and while loops.','loops'],
['07','Functions','Python Basics','Create reusable functions with parameters and return values.','functions'],
['08','Modules & Packages','Python Basics','Organize code and reuse modules and packages.','modules-packages'],
['09','Exception Handling','Python Basics','Handle runtime errors with try, except and finally.','exception-handling'],
['10','File Handling','Python Basics','Read, write and manage files safely.','file-handling'],
['11','Strings','Intermediate Python','Work with text, slicing, methods and formatting.','strings'],
['12','Lists','Intermediate Python','Store and manipulate ordered collections.','lists'],
['13','Tuples','Intermediate Python','Use immutable ordered collections.','tuples'],
['14','Sets','Intermediate Python','Work with unique values and set operations.','sets'],
['15','Dictionaries','Intermediate Python','Store key-value data and access it efficiently.','dictionaries'],
['16','List Comprehensions','Intermediate Python','Create collections with compact readable expressions.','comprehension'],
['17','Lambda Functions','Intermediate Python','Write small anonymous functions for quick operations.','lambda-functions'],
['18','Map, Filter & Reduce','Intermediate Python','Transform and filter data with functional tools.','map-filter-reduce'],
['19','OOP (Classes & Objects)','Intermediate Python','Model real-world ideas using classes, objects and methods.','oop'],
['20','Iterators & Generators','Intermediate Python','Use lazy iteration with iterators and yield.','iterators-generators'],
['21','NumPy','Libraries & Tools','Perform numerical computing with arrays.','numpy'],
['22','Pandas','Libraries & Tools','Manipulate and analyze tabular data with DataFrames.','pandas'],
['23','Matplotlib','Libraries & Tools','Create charts and data visualizations.','matplotlib'],
['24','Seaborn','Libraries & Tools','Build attractive statistical visualizations.','seaborn'],
['25','Requests','Libraries & Tools','Send HTTP requests and work with APIs.','requests'],
['26','BeautifulSoup','Libraries & Tools','Parse HTML and extract web data.','beautiful-soup'],
['27','Flask','Libraries & Tools','Build lightweight Python web applications.','flask'],
['28','Django','Libraries & Tools','Build structured full-stack web applications.','django'],
['29','Virtual Environment (venv)','Libraries & Tools','Isolate project dependencies with venv and pip.','virtual-environment'],
['30','Git & GitHub','Libraries & Tools','Track changes and collaborate on Python projects.','git-github'],
['31','Calculator App','Practice & Projects','Build basic arithmetic operations in a small app.',''],
['32','Password Generator','Practice & Projects','Generate strong random passwords using Python.',''],
['33','To-Do List App','Practice & Projects','Add, delete and manage tasks.',''],
['34','Weather App','Practice & Projects','Fetch real-time weather data using an API.',''],
['35','Expense Tracker','Practice & Projects','Track income, expenses and balance.',''],
['36','Web Scraper','Practice & Projects','Extract useful data from websites.',''],
['37','REST API','Practice & Projects','Build APIs using Flask or Django.',''],
['38','Automation Scripts','Practice & Projects','Automate repetitive daily tasks.',''],
['39','Data Analysis Project','Practice & Projects','Analyze data using Pandas, NumPy and Matplotlib.',''],
['40','Portfolio Project','Practice & Projects','Build and deploy a complete Python project.','']
];
const lessonContent={
'Variables':['A variable is a name that refers to a value.','Store information and update it when needed.','age = 18\nname = "Bheem"\nprint(name, age)','Create variables for your name, age and city.'],
'Data Types':['Python values have different types such as int, float, str and bool.','Choose the right type and check it with type().','age = 18\nprice = 99.5\nactive = True\nprint(type(age))','Create one example of each basic data type.'],
'Input & Output':['input() reads text from the user and print() displays output.','Build simple interactive programs.','name = input("Name: ")\nprint("Hello", name)','Ask for a user name and favorite language.'],
'Operators':['Operators perform calculations and comparisons.','Use arithmetic, comparison and logical operators correctly.','a = 10\nb = 3\nprint(a + b, a > b)','Calculate the total price of two items.'],
'Conditional Statements':['Conditions let a program choose between paths.','Use if, elif and else to make decisions.','score = 85\nif score >= 60:\n    print("Pass")\nelse:\n    print("Try again")','Write a program that checks whether a number is positive.'],
'Loops':['Loops repeat a block of code.','Use for for sequences and while for condition-based repetition.','for i in range(1, 6):\n    print(i)','Print the numbers from 10 down to 1.'],
'Functions':['Functions package reusable logic into a named block.','Use parameters and return values.','def add(a, b):\n    return a + b\nprint(add(10, 20))','Create a function that returns the square of a number.'],
'Modules & Packages':['Modules keep related Python code organized and reusable.','Import standard-library and third-party modules.','import math\nprint(math.sqrt(25))','Import a module and use one useful function from it.'],
'Exception Handling':['Exceptions are runtime problems that a program can handle gracefully.','Use try and except to prevent crashes.','try:\n    n = int(input("Number: "))\nexcept ValueError:\n    print("Please enter a number")','Handle division by zero safely.'],
'File Handling':['Files let programs persist information beyond a single run.','Read and write text files with with open().','with open("notes.txt", "w") as f:\n    f.write("Python Hero")','Write three lines to a file and read them back.'],
'Strings':['Strings are sequences of characters used for text.','Use slicing, methods and f-strings.','name = "Bheem"\nprint(name.upper())\nprint(f"Hi {name}")','Count the vowels in a string.'],
'Lists':['Lists store ordered, changeable collections.','Append, remove, sort and loop through list items.','heroes = ["Bheem", "Raju"]\nheroes.append("Chutki")\nprint(heroes)','Create a list of five Python topics and print each one.'],
'Tuples':['Tuples are ordered collections that cannot be changed after creation.','Use tuples for fixed groups of values.','point = (10, 20)\nprint(point[0])','Create a tuple containing three cities.'],
'Sets':['Sets store unique values without duplicate entries.','Use union, intersection and difference.','a = {1,2,3}\nb = {3,4,5}\nprint(a & b)','Find common values in two sets.'],
'Dictionaries':['Dictionaries store data as key-value pairs.','Create, update and safely access values.','hero = {"name":"Bheem", "score":95}\nprint(hero["name"])','Create a dictionary for a student with name and marks.'],
'List Comprehensions':['Comprehensions create collections in a compact readable way.','Add expressions and conditions to build new lists.','squares = [x*x for x in range(1,6)]\nprint(squares)','Create a list of even numbers from 1 to 20.'],
'Lambda Functions':['A lambda is a small anonymous function.','Use lambda for short transformations and sorting keys.','double = lambda x: x * 2\nprint(double(5))','Create a lambda that adds 10 to a number.'],
'Map, Filter & Reduce':['These tools process collections using functions.','Map transforms, filter selects and reduce combines values.','nums = [1,2,3,4]\nprint(list(map(lambda x:x*2, nums)))','Filter a list to keep only numbers greater than 5.'],
'OOP (Classes & Objects)':['Classes define reusable blueprints; objects are instances of those classes.','Use attributes and methods to model real things.','class Hero:\n    def __init__(self, name):\n        self.name = name\nhero = Hero("Bheem")\nprint(hero.name)','Create a Student class with name and marks.'],
'Iterators & Generators':['Iterators produce values one at a time; generators use yield.','Process large sequences without storing everything at once.','def count_up(n):\n    for i in range(1,n+1):\n        yield i\nprint(list(count_up(5)))','Create a generator for odd numbers.'],
'NumPy':['NumPy provides fast array-based numerical operations.','Create arrays, slice them and calculate statistics.','import numpy as np\na=np.array([10,20,30,40,50])\nprint(a.mean())','Create an array and print its maximum value.'],
'Pandas':['Pandas provides Series and DataFrame tools for data analysis.','Load, filter and summarize tabular data.','import pandas as pd\ndf=pd.DataFrame({"Score":[95,88,92]})\nprint(df["Score"].mean())','Create a DataFrame with three students and filter scores above 90.'],
'Matplotlib':['Matplotlib creates charts from Python data.','Choose suitable chart types and label them.','import matplotlib.pyplot as plt\nplt.plot([1,4,2,5])\nplt.title("Hero Progress")\nplt.show()','Create a bar chart for four monthly values.'],
'Seaborn':['Seaborn builds statistical charts on top of Matplotlib.','Use it to explore relationships and distributions.','import seaborn as sns\nsns.set_theme()\nsns.histplot([1,2,2,3,4,4,4])','Try a scatter plot with two numeric lists.'],
'Requests':['Requests makes HTTP calls from Python.','Send GET requests and inspect status codes or JSON.','import requests\nr=requests.get("https://example.com")\nprint(r.status_code)','Make a GET request and print its status code.'],
'BeautifulSoup':['BeautifulSoup parses HTML documents.','Find tags and extract text from web pages.','from bs4 import BeautifulSoup\nsoup=BeautifulSoup("<h1>Python</h1>","html.parser")\nprint(soup.h1.text)','Parse a small HTML string and extract a heading.'],
'Flask':['Flask is a lightweight Python web framework.','Create routes and return HTML or JSON.','from flask import Flask\napp=Flask(__name__)\n@app.get("/")\ndef home(): return "Hello Python"','Create a /hello route that returns a message.'],
'Django':['Django is a full-featured Python web framework.','Understand projects, apps, URLs, views and models.','python -m pip install django\ndjango-admin startproject mysite','List the steps needed to create a Django project.'],
'Virtual Environment (venv)':['A virtual environment isolates dependencies for each project.','Create, activate and install packages safely.','python -m venv .venv\n# Windows: .venv\Scripts\activate','Create a venv and install one package into it.'],
'Git & GitHub':['Git tracks code history; GitHub hosts and collaborates on repositories.','Commit changes and push projects safely.','git init\ngit add .\ngit commit -m "first commit"','Create a repository and make your first commit.'],
'Calculator App':['Build a small calculator using input, operators and functions.','Combine basics into a useful command-line app.','a=float(input("A: "))\nb=float(input("B: "))\nprint(a+b)','Add support for multiplication, division and a menu.'],
'Password Generator':['Generate strong random passwords from letters, numbers and symbols.','Use random choices and configurable length.','import secrets, string\nchars=string.ascii_letters+string.digits+"@#$%"\nprint("".join(secrets.choice(chars) for _ in range(12)))','Let the user choose password length.'],
'To-Do List App':['Manage tasks with lists, functions and file handling.','Add, delete, view and save tasks.','tasks=[]\ntasks.append("Learn Python")\nprint(tasks)','Add delete and save-to-file features.'],
'Weather App':['Fetch live weather data from an API.','Work with requests, JSON and user input.','import requests\n# use your weather API key here\nprint("Fetch city weather")','Ask for a city name and display temperature.'],
'Expense Tracker':['Track income and expenses and calculate a balance.','Combine dictionaries, lists and functions.','transactions=[{"type":"income","amount":1000},{"type":"expense","amount":250}]\nprint(sum(x["amount"] for x in transactions if x["type"]=="income"))','Add a monthly summary and category totals.'],
'Web Scraper':['Extract structured information from a web page.','Combine requests and BeautifulSoup carefully and ethically.','import requests\nfrom bs4 import BeautifulSoup\nsoup=BeautifulSoup("<h2>Python</h2>","html.parser")\nprint(soup.h2.text)','Save extracted titles into a CSV file.'],
'REST API':['Build endpoints that exchange structured JSON data.','Use routes, methods and request/response handling.','from flask import Flask, jsonify\napp=Flask(__name__)\n@app.get("/hello")\ndef hello(): return jsonify(message="Hello API")','Add GET and POST endpoints backed by a database.'],
'Automation Scripts':['Automate repetitive file and data tasks.','Use os, shutil, pathlib and datetime safely.','from pathlib import Path\nfor p in Path(".").glob("*.txt"): print(p)','Automate a backup or file-organizing task.'],
'Data Analysis Project':['Turn a dataset into findings and visualizations.','Combine Pandas, NumPy and Matplotlib.','import pandas as pd\ndf=pd.DataFrame({"sales":[10,20,15,30]})\nprint(df.describe())','Find the top values and create two charts.'],
'Portfolio Project':['Bring your Python skills together in a deployable project.','Plan features, build, test, document and deploy.','print("My Python Portfolio")','Build a portfolio with About, Projects and Contact sections.']
};
const projects=[['Calculator','Variables, operators, input/output'],['Number Guessing Game','Conditions, loops, random'],['To-Do CLI','Lists, dictionaries and functions'],['Expense Tracker','Files + dictionaries + functions'],['Data Analysis','NumPy + Pandas + Matplotlib'],['Visualization Dashboard','Pandas + Seaborn'],['API Explorer','Requests + JSON'],['Web Scraper','Requests + Beautiful Soup'],['Flask Mini App','Flask + templates + forms'],['Django Blog','Django + models + admin']];
const challenges=[
['Reverse a Number','Write a while loop to reverse 12345.','print(str(12345)[::-1])','Easy'],
['Score Filter','Using Pandas, keep rows where Score > 90.','import pandas as pd\ndf=pd.DataFrame({"Name":["Bheem","Raju","Chutki"],"Score":[95,88,92]})\nprint(df[df["Score"]>90])','Data'],
['NumPy Mean','Create an array [10,20,30,40,50] and print its mean.','import numpy as np\na=np.array([10,20,30,40,50])\nprint(np.mean(a))','Data'],
['API Status','Use requests.get() and print the status code.','import requests\nr=requests.get("https://example.com")\nprint(r.status_code)','Web']
];
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
let selectedStage='all'; let completedLessons=[];
const stageKeys={'Python Basics':'basics','Intermediate Python':'intermediate','Libraries & Tools':'libraries','Practice & Projects':'projects'};
function lessonByNo(no){return lessons.find(x=>+x[0]===+no)}
function renderLessons(){const q=($('#search')?.value||'').toLowerCase(); const list=lessons.filter(x=>(selectedStage==='all'||stageKeys[x[2]]===selectedStage)&&x[1].toLowerCase().includes(q)); $('#lessonGrid').innerHTML=list.map(x=>`<article class="lesson-card ${completedLessons.includes(+x[0])?'completed':''}" data-no="${x[0]}"><span class="num">${x[0]} • ${x[2]}</span><h3>${x[1]}</h3><span class="tag">${completedLessons.includes(+x[0])?'✓ Completed':x[2]}</span>${x[4]?`<img class="comic-thumb" src="/static/img/comics/${x[4]}.jpg?v=20" alt="${x[1]} comic poster" loading="lazy" onerror="this.onerror=null;this.src='/static/img/comics/introduction-to-python.jpg?v=20'">`:''}<p>${x[3]}</p><button class="btn ghost lesson-open" data-no="${x[0]}" style="width:100%">📖 Learn this lesson</button></article>`).join(''); $$('.lesson-open').forEach(b=>b.onclick=()=>openLesson(+b.dataset.no));}
function renderComics(){const q=($('#search')?.value||'').toLowerCase(); const list=lessons.filter(x=>(selectedStage==='all'||stageKeys[x[2]]===selectedStage)&&x[4]&&x[1].toLowerCase().includes(q)); $('#comicGrid').innerHTML=list.map(x=>`<figure class="comic comic-open" data-img="${x[4]}"><img src="/static/img/comics/${x[4]}.jpg" alt="${x[1]} comic poster" loading="lazy"><figcaption>Module ${x[0]} • ${x[1]}</figcaption></figure>`).join(''); $$('.comic-open').forEach(el=>el.onclick=()=>openComic(el.dataset.img));}
function openComic(slug){const lesson=lessons.find(x=>x[4]===slug); if(!lesson)return; openLesson(+lesson[0],true);}
function updateProgress(){const n=completedLessons.length; const pct=Math.round(n/40*100); $('#progressPill').textContent=`${n} / 40 complete`; $('#overallProgressBar').style.width=pct+'%'; $('#overallProgressText').textContent=pct+'%';}
function openLesson(no, comicOnly=false){const l=lessonByNo(no); if(!l)return; const c=lessonContent[l[1]]; const img=l[4]?`<div class="lesson-comic"><img src="/static/img/comics/${l[4]}.jpg?v=20" alt="${l[1]} comic" onerror="this.onerror=null;this.src='/static/img/comics/introduction-to-python.jpg?v=20'"></div>`:''; const detail=`<div class="lesson-detail-card"><div class="lesson-top"><span class="eyebrow">UNIT ${l[0]} • ${l[2].toUpperCase()}</span><span class="tag">${completedLessons.includes(no)?'✓ Completed':'In progress'}</span></div><h2>${l[1]}</h2><p class="lesson-concept">${c[0]}</p>${img}<div class="lesson-columns"><div><h3>🎯 What you'll learn</h3><p>${c[1]}</p><h3>💡 Example</h3><pre class="lesson-code">${escapeHtml(c[2])}</pre></div><div><h3>🏆 Challenge</h3><p>${c[3]}</p><button class="btn primary" id="completeLessonBtn" ${completedLessons.includes(no)?'disabled':''}>${completedLessons.includes(no)?'✓ Lesson Complete':'Mark as Complete'}</button><a class="btn ghost" href="#compiler" id="tryLessonBtn">💻 Try in Compiler</a></div></div></div>`; $('#lessonDetail').innerHTML=detail; if(!comicOnly) $('#lessonZone').scrollIntoView({behavior:'smooth',block:'start'}); $('#completeLessonBtn')?.addEventListener('click',async()=>{const r=await fetch(`/api/progress/${no}/complete`,{method:'POST'}); const d=await r.json(); if(d.ok){if(!completedLessons.includes(no))completedLessons.push(no); updateProgress(); renderLessons(); openLesson(no);}}); $('#tryLessonBtn')?.addEventListener('click',()=>{ $('#codeEditor').value=c[2]; });}
function escapeHtml(v){return v.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));}
function renderPractice(){$('#quizGrid').innerHTML=challenges.map((c,i)=>`<div class="quiz"><span class="tag">${c[3]}</span><h3>${i+1}. ${c[0]}</h3><p>${c[1]}</p><input id="ans${i}" placeholder="Type your answer/output idea"><button class="btn primary check" data-i="${i}">Check idea</button><p id="fb${i}" class="auth-hint"></p></div>`).join('');$$('.check').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;const val=$('#ans'+i).value.trim();$('#fb'+i).textContent=val?'Nice! Now compare your idea with the sample code in the compiler.':'Try typing your approach first — even if it is not perfect.';});}
function renderProjects(){const ps=lessons.slice(30);$('#projectList').innerHTML=ps.map((p,i)=>`<article class="project"><span class="num">PROJECT ${p[0]}</span><h3>${p[1]}</h3><p>${p[3]}</p><button class="btn ghost project-open" data-no="${p[0]}">Learn & Build →</button></article>`).join('');$$('.project-open').forEach(b=>b.onclick=()=>openLesson(+b.dataset.no));}
const samples={hello:`print("Hello, Python Hero!")\nname="Bheem"\nprint("Welcome",name)`,loops:`for i in range(1,6):\n    print("Count:",i)\n\nnumber=12345\nreverse=0\nwhile number>0:\n    digit=number%10\n    reverse=reverse*10+digit\n    number//=10\nprint("Reverse:",reverse)`,lists:`students=["Bheem","Raju","Chutki"]\nscores={"Bheem":95,"Raju":88,"Chutki":92}\nprint(students)\nprint(scores["Bheem"])`,functions:`def add(a,b):\n    return a+b\n\nprint(add(10,20))`,numpy:`import numpy as np\na=np.array([10,20,30,40,50])\nprint("Array:",a)\nprint("Mean:",np.mean(a))\nprint("Sum:",np.sum(a))`,pandas:`import pandas as pd\ndata={"Name":["Bheem","Raju","Chutki"],"Score":[95,88,92]}\ndf=pd.DataFrame(data)\nprint(df)\nprint("High scores:")\nprint(df[df["Score"]>90])`};
let pyodide=null;
function setupPyodideIO(){
  pyodide.setStdin({stdin:()=>{
    const value=window.prompt('Python input:');
    return value===null?'':String(value);
  },isatty:true});
}
async function initPython(){try{pyodide=await loadPyodide();setupPyodideIO();$('#pyStatus').textContent='Python 3 ready ✓';}catch(e){$('#pyStatus').textContent='Python engine unavailable';}}
async function runCode(){const out=$('#output');out.textContent='Running…';try{if(!pyodide){pyodide=await loadPyodide();setupPyodideIO();}else{setupPyodideIO();}await pyodide.loadPackagesFromImports($('#codeEditor').value);let output='';pyodide.setStdout({batched:s=>output+=s});pyodide.setStderr({batched:s=>output+=s});await pyodide.runPythonAsync($('#codeEditor').value);out.textContent=output||'(No output)';}catch(e){const msg=String(e);out.textContent=msg.includes('I/O error')?'Input was cancelled or unavailable. Please enter a value when Python asks for input.':'Error:\n'+msg;}}
function setupAuth(){const overlay=$('#authOverlay');$('#accountBtn').onclick=()=>overlay.classList.add('open');$('#authClose').onclick=()=>overlay.classList.remove('open');overlay.onclick=e=>{if(e.target===overlay)overlay.classList.remove('open')};$$('.auth-tab').forEach(t=>t.onclick=()=>{$$('.auth-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');const reg=t.dataset.tab==='register';$('#loginForm').classList.toggle('hidden',reg);$('#registerForm').classList.toggle('hidden',!reg)});$('#loginForm').onsubmit=async e=>{e.preventDefault();const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:$('#loginUser').value,password:$('#loginPass').value})});const d=await r.json();if(!r.ok){$('#loginError').textContent=d.error;return}if(d.user.role==='admin'){location='/admin'}else{overlay.classList.remove('open');$('#accountBtn').textContent='Logged in ✓';$('#loginError').textContent='';}};$('#registerForm').onsubmit=async e=>{e.preventDefault();const r=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:$('#regUser').value,password:$('#regPass').value})});const d=await r.json();if(!r.ok){$('#regError').textContent=d.error;return}overlay.classList.remove('open');$('#accountBtn').textContent='Logged in ✓';};}
function setupTheme(){const saved=localStorage.getItem('theme');if(saved)document.documentElement.dataset.theme=saved;$('#themeBtn').textContent=saved==='dark'?'☀️':'🌙';$('#themeBtn').onclick=()=>{const dark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=dark?'light':'dark';localStorage.setItem('theme',dark?'light':'dark');$('#themeBtn').textContent=dark?'🌙':'☀️';};}
async function loadProgress(){try{const r=await fetch('/api/progress'); if(r.ok){const d=await r.json(); completedLessons=d.completed||[]; updateProgress();}}catch(e){}}
function setup(){renderLessons();renderComics();renderPractice();renderProjects();$('#search').oninput=()=>{renderLessons();renderComics()};$('#stageSelect').onchange=e=>{selectedStage=e.target.value;renderLessons();renderComics()}; $$('.roadmap-click').forEach(n=>n.onclick=()=>{selectedStage=n.dataset.stage;$('#stageSelect').value=selectedStage;renderLessons();renderComics();$('#modules').scrollIntoView({behavior:'smooth'});});$('#runBtn').onclick=runCode;$('#clearBtn').onclick=()=>$('#codeEditor').value='';$('#clearOutput').onclick=()=>$('#output').textContent='';$('#sampleSelect').onchange=e=>$('#codeEditor').value=samples[e.target.value];$('#close').onclick=()=>$('#modal').classList.remove('open');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('open')};setupTheme();initPython();loadProgress();updateProgress();}
document.addEventListener('DOMContentLoaded',setup);


// Lightweight 3D hero parallax — no library required.
function setupHero3D(){
  const stage=document.getElementById('hero3d');
  if(!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cube=stage.querySelector('.python-cube');
  const comic=stage.querySelector('.hero-single-comic');
  stage.addEventListener('pointermove',e=>{
    const r=stage.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    if(cube) cube.style.transform=`translate3d(${x*18}px,${y*18}px,0) rotateX(${-y*14}deg) rotateY(${x*18}deg)`;
    if(comic) comic.style.transform=`translate3d(${x*-8}px,${y*-8}px,0) rotate(${x*2}deg)`;
  });
  stage.addEventListener('pointerleave',()=>{
    if(cube) cube.style.transform='translate3d(0,0,0) rotateX(-8deg) rotateY(12deg)';
    if(comic) comic.style.transform='translate3d(0,0,0) rotate(2deg)';
  });
}
document.addEventListener('DOMContentLoaded',setupHero3D);
