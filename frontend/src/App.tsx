import { useState, type ChangeEvent } from 'react'


interface kpi{
    avg_reduction_pct: number;
    total_energy_kwh: number;
    total_samples: number;
    avg_duration_min: number;
}

const API_URL = 'http://localhost:8000/analyze';

const cards:{key: keyof kpi; title: string; unit:string; color:string}[] = [
  {key: 'avg_reduction_pct', title: 'Average Reduction', unit: '%',color: '#0e7490'},
  {key: 'total_energy_kwh', title: 'Total Energy', unit: 'kWh',color: '#b45309'},
  {key: 'total_samples', title: 'Total Samples', unit: '',color: '#6d28d9'},
  {key: 'avg_duration_min', title: 'Average Duration', unit: 'min', color: '#be123c' }
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
    <main style={{background:' #e0f2fe', minHeight:'100vh',color: '#1e293b',fontFamily:'sans-serif'}}>
    <div style={{ maxWidth:880,margin:'0 auto',}}>
      <h1 style={{ color: '#0f172a' }}>
        R&D Dashboard
      </h1>
      <p>Upload an Electrochecmical experiment log(CSV) to compute KPIs.</p>
      
      <div style={{ background: '#fff', borderRadius: 16, padding: '25px 0px 25px 0px', marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.1)',alignContent:'center', justifyContent:'center'}}>
        <label style={{fontWeight:600, width:'100%'}}>
          Upload CSV File
        </label>
        <input type='file' accept='.csv' onChange={onSelect} style={{padding:10, border:'2px dashed #6366f1',marginTop:16, borderRadius:8}}/>
        <button style={{marginTop:16, display:'flex',cursor:'pointer',minHeight:44,padding:'0 28px',borderRadius:8,background:'#6366f1', color:'#fff',alignItems:'center'}} onClick={analyze} disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 16, padding: '12px 16px', borderLeft: '6px solid #b91c1c', background: '#fee2e2', color: '#7f1d1d', borderRadius: 8 }}>
          Error:{error}</p>
      )}

      {kpi && (
        <div style={{display:'grid', gridTemplateColumns:'repeat(2 , 1fr)', gap:25, marginTop:40}}>
          {cards.map(({key,title,unit,color})=>(
            <div key={key} style={{background:'#fff', borderRadius:16,padding:20, borderTop:`8px solid ${color}`, boxShadow:'0 4px 16px rgba(0,0,0,.1)'}}>
              <div style={{fontSize:14, color:'#475569', marginBottom:10}}>
                {title}
                </div>
              <div style={{fontSize:28, fontWeight:700,color}}>
                {kpi[key]}{unit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </main>
  );
}

export default App
