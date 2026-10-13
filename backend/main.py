from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI()

# Enable CORS for local TypeScript frontend interaction
app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_experiment_data(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Calculate R&D KPIs
    reduction_pct = ((df['Initial_PFAS_ppb'] - df['Final_PFAS_ppb']) / df['Initial_PFAS_ppb']) * 100
    avg_reduction_pct = reduction_pct.mean()
    total_energy_kwh = df['Energy_kWh'].sum()
    total_samples = int(len(df))
    avg_duration_min = df['Duration_min'].mean()
    
    return {
        "avg_reduction_pct": round(avg_reduction_pct, 2),
        "total_energy_kwh": round(total_energy_kwh, 2),
        "total_samples": total_samples,
        "avg_duration_min": round(avg_duration_min, 1)
    }