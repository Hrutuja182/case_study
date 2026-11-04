# case_study

1.Started with git repository :Created git repository and then clone it in folder case_study. 
2.according intructions for Backend
  Create a root folder named case_study and open it in VS Code. Open the integrated terminal.

  Create a backend directory: mkdir backend and then cd backend.

  Create a Python virtual environment: python -m venv venv.

  Activate the virtual environment (e.g., .\venv\Scripts\activate on Windows).

  Upgrade pip using trusted hosts to avoid network errors:
    #python -m pip install --upgrade pip --trusted-host pypi.org --trusted-host      files.pythonhosted.org

   Install the required backend packages:
    # pip install uvicorn pandas python-multipart
           or 
    # pip install fastapi uvicorn pandas python-multipart

     not rendering main.py so added manually
    # notepad main.py
    
    Go back to your backend terminal after frontend setup(ensure the virtual environment is active) and start the Python API:
   # uvicorn main:app --reload

3.for frontend 
  Open a new terminal panel in VS Code, navigate back to the root case_study folder, and create the frontend:
   #npm create vite@latest frontend -- --template react-ts

  When prompted by the Vite setup menu:

  Select ESLint as your linter.

  Select Yes for "Install with npm and start now?".

  Open the provided local link (typically http://localhost:5173/) in your browser to verify the frontend server is running.


  Update frontend/src/App.tsx with your custom code to handle file uploading, API communication, and KPI rendering.

Test your application by uploading the provided CSV file and checking if the UI correctly displays the performance metrics. A simple, clean UI is perfectly acceptable.


4. git
pushed changes to branch
# git add .
# git commit -m "dashboard changes"
# git push --set-upstream origin "R&D-dashboard"

5.build in backend
 1. added requirements.txt file
   fastapi
   uvicorn
   pandas
   python-multipart

 2. then commit chnages and push to github branch
 3. open render.com and sign up with github. New --> webservice, picked my repo and deploy 
 4. Fill in:
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance type: Free

6.frontend Build:
 1. added    const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/analyze`;
 to app.tsx file.
 2. then created file
       .env.production
 3. open console.firebase.google.com and click Add project. Create a new project
 4. in powershell:
    # npm install -g firebase-tools
   # firebase login
   # cd frontend
   # firebase init hosting

5. # npm run build
   # firebase deploy --only hosting

6. wee need add allow_origins=["https://case-study-f0f12.web.app", "https://case-study-f0f12.firebaseapp.com"]