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
# git push