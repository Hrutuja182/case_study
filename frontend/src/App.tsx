import { useState, type ChangeEvent } from 'react'


interface kpi{
    avg_reduction_pct: number;
    total_energy_kwh: number;
    total_samples: number;
    avg_duration_min: number;
}

const API_URL = 'http://localhost:8000/analyze';

const cards:{key: keyof kpi; title: string; unit:string}[] = [
  {key: 'avg_reduction_pct', title: 'Average Reduction', unit: '%'},
  {key: 'total_energy_kwh', title: 'Total Energy', unit: 'kWh'},
  {key: 'total_samples', title: 'Total Samples', unit: ''},
  {key: 'avg_duration_min', title: 'Average Duration', unit: 'min'}
];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [kpi, setKpi] = useState<kpi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelect =(e:ChangeEvent<HTMLInputElement>)=>{
    setFile(e.target.files?.[0]??null);
    setKpi(null);
    setError(null);
  }

  const analyze = async()=>{
    if(!file) return;
      setLoading(true);
      setError(null);
      setKpi(null);
      const formData =new FormData();
      formData.append('file',file);

      try{
        const response = await fetch(API_URL,{ method:'POST', body:formData });
        if(!response.ok){
          const body = await response.json().catch(()=>null);
          throw new Error(body?.detail ??'server error(${response.status})');
        }
        setKpi(await response.json());

      }
      catch(err){
        setError((err as Error).message);
      }
      finally{
        setLoading(false);
      }
  };

  return(
    <div style={{maxWidth:'720px',margin:'40px auto',fontFamily:'sans-serif'}}>
      <h1>R&D Dashboard</h1>
      <p>Upload an Electrochecmical experiment log(CSV) to compute KPIs.</p>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <input type='file' accept='.csv' onChange={onSelect}/>
        <button onClick={analyze} disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && (
        <p style ={{color:'red', marginTop:16}}>Error:{error}</p>
      )}

      {kpi && (
        <div style={{display:'grid', gridTemplateColumns:'repeat(2 , 1fr)', gap:16, marginTop:24}}>
          {cards.map(({key,title,unit})=>(
            <div key={key} style={{border:'1px solid #ccc', borderRadius:8,padding:16}}>
              <div style={{fontSize:13, color:'#666'}}>{title}</div>
              <div style={{fontSize:28, fontWeight:600}}>
                {kpi[key]}{unit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App
