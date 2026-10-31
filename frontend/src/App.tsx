import { useState, type ChangeEvent } from 'react'


interface kpi{
    avg_reduction_pct: number;
    total_energy_kwh: number;
    total_samples: number;
    avg_duration_min: number;
}

type card ={          //(type alises) card object
  key: keyof kpi;
  title: string; 
  unit:string; 
  color:string
}
const API_URL = 'http://localhost:8000/analyze';

const cards:card[] = [
  {key: 'avg_reduction_pct', title: 'Average Reduction', unit: ' %',color: '#0e7490'},
  {key: 'total_energy_kwh', title: 'Total Energy', unit: ' kWh',color: '#b45309'},
  {key: 'total_samples', title: 'Total Samples', unit: '',color: '#6d28d9'},
  {key: 'avg_duration_min', title: 'Average Duration', unit: ' min', color: '#be123c' }
];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [kpi, setKpi] = useState<kpi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);
  
  const disablebutton= !file || loading;
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
         console.log('response',response)
        if(!response.ok){
          const body = await response.json().catch(()=>null);
          console.log('body',body)
          throw new Error(typeof body?.detail === 'string' ? body.detail : `Server error (${response.status})`);
        }
        setKpi(await response.json());

      }
      catch(err){
        console.log('error',err)
        setError((err as Error).message);
      }
      finally{
        setLoading(false);
      }
  };

  return(
    <main style={{background:'#e0f2fe', minHeight:'100vh',color: '#1e293b',fontFamily:'sans-serif'}}>
    <div style={{ maxWidth:880,margin:'0 auto',}}>
      <h1 style={{ color: '#0f172a',marginTop:'60px' }}>
        R&D Dashboard
      </h1>
      <p>Upload an Electrochemical experiment log(CSV) to compute KPIs.</p>
      
      <div style={{ background:'#fff', borderRadius:16, padding:'25px 0px 25px 0px', margin: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.1)',alignContent:'center', justifyContent:'center'}}>
        <label htmlFor='csv-file' style={{fontWeight:600, width:'100%'}}>
          Upload CSV File
        </label>
        <input id='csv-file' type='file' accept='.csv' onChange={onSelect} style={{padding:10, border:'2px dashed #6366f1',marginTop:16, borderRadius:8}}/>

        <span onMouseEnter={()=> setShowTip(true)} onMouseLeave={() => setShowTip(false)} style={{ marginTop :16, cursor:disablebutton ? 'default':'pointer', position:'relative', display:'inline-block', }}>
        <button disabled={disablebutton} style={{ display:'flex',cursor: disablebutton ? 'default' :'pointer',minHeight:44, padding:'0 28px', borderRadius:8,background: disablebutton ? '#ccc':'#6366f1', color:'#fff',alignItems:'center'}} onClick={analyze}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {showTip && !file && (
          <span role='tooltip' style={{ position:'absolute', bottom:'110%', left:'50%', transform:'translateX(-50%)', background:'#1e293b', color:'#fff', padding:'6px 10px', borderRadius:6, fontSize:13, whiteSpace:'nowrap' }}>
            Please upload a CSV file to analyze.
          </span>
        )}
        </span>
      </div>

      {error && (
        <p style={{ marginTop: 16, padding: '12px 16px', background: '#fee2e2', color: '#7f1d1d', borderRadius: 8 }}>
          Error:{error}</p>
      )}

      {kpi && (
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:25, marginTop:40,}}>
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
