# CPO Integration Dashboard
This repo is a basic implementation of a CPO integration dashboard.
Currently two basic use cases are implemented:
- Charge Point Status Overview:
  Get the status off all CPO charge points and summarize a status of free, busy and out of order charge points.
- Charging Sesssion Data Overview:
  Get the charging sessions of all EMAIDs and summarize the session data per EMAID and per month of the year.

Currently the Dashboard is implemented using [vaylens Portal APIs](https://api.vaylens.com/ui/home): 

# How to start the Dashboard
## Prerequisite
```
npm > '9.8.1'
node > '19.5.0'
python > '3.11.1'
```
## Configure settings
Copy `./backend/settings/settings.example.py` to `./backend/settings/settings.py` and adapt the configuration data (especially API keys etc.).
## Prepare and start the backend
Start new terminal in project folder and execute the following commands:
```
cd ./backend
# Create venv
python -m venv venv
# Activate venv
source venv/bin/activate
# Install dependencies
pip install --no-cache-dir -r requirements.txt
# Start the backend
python ./main.py 
```
## Prepare and start the frontend
Start new terminal in project folder and execute the following commands:
```
cd ./frontend
# Install dependencies
npm install
# Start frontend
npm run start
```

# How the Dashboard is implemented
The Dashboard consists of two components
1. Backend: Exposes a REST API which is used by the frontend. Connects to the CPO backend using the defined APIs. Gathers the needed data and prepares it for the frontend.
1. Frontend: Renders the frontend using ReactJS.
## Backend
The backend uses the `FastAPI framework` (https://fastapi.tiangolo.com/) to expose the needed REST API.
Currently no gathered data is stored, however the implementation is already prepared for a data storage (e.g. SQL database).
## Frontend
The frontend is bootstrapped using `Create React App` (https://create-react-app.dev/).
