import { useState, type ChangeEvent } from 'react'

interface kpi{
    avg_reduction_pct: number;
    total_energy_kwh: number;
    total_samples: number;
    avg_duration_min: number;
}

//const API_URL = 'http://localhost:8000/analyze';
const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/analyze`;

interface card{          
  key: keyof kpi;
  title: string; 
  unit:string; 
  color:string
}

const cards:card[] = [
  {key: 'avg_reduction_pct', title: 'Average Reduction', unit: ' %',color: '#0e7490'},
  {key: 'total_energy_kwh', title: 'Total Energy', unit: ' kWh',color: '#b45309'},
  {key: 'total_samples', title: 'Total Samples', unit: '',color: '#6d28d9'},
  {key: 'avg_duration_min', title: 'Average Duration', unit: ' min', color: '#be123c' }
];

const styles={
  page:{position:'fixed', inset:0, overflowY:'auto', background:'#e0f2fe', padding:'0 16px', boxSizing:'border-box', textAlign:'center', color:'#1e293b', fontFamily:'sans-serif'},
  container:{ maxWidth:880,margin:'0 auto',},
  uploadBox:{ background:'#fff', borderRadius:16, padding:25, marginTop:24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.1)',alignContent:'center', justifyContent:'center'},
  input:{padding:10, border:'2px dashed #6366f1', borderRadius:8},
  hint:{ width: '100%', textAlign: 'center', margin: 0, fontSize: 14, color: '#475569' },
  error:{ marginTop: 16, padding: '12px 16px', background: '#fee2e2', color: '#7f1d1d', borderRadius: 8 },
  grid:{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:25, margin:40,},
  cardTitle:{fontSize:14, color:'#475569', marginBottom:10},  
} as const;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [kpi, setKpi] = useState<kpi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disablebutton= !file || loading;
  const onSelect =(e:ChangeEvent<HTMLInputElement>)=>{
    setFile(e.target.files?.[0]??null);
    setKpi(null);
    setError('');
  }
  const analyze = async()=>{
    if(!file) return;
      setLoading(true);
      setError('');
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
    <main style={styles.page}>
    <div style={styles.container}>
      <h1 style={{ color: '#0f172a',marginTop:'60px' }}>
        R&D Dashboard
      </h1>
      <p>Upload an Electrochemical experiment log(CSV) to compute KPIs.</p> 
      <div style={styles.uploadBox}>
        <label htmlFor='csv-file' style={{fontWeight:600, width:'100%'}}>
          Upload CSV File
        </label>
        <input id='csv-file' type='file' accept='.csv' onChange={onSelect} style={styles.input}/>
        <button disabled={disablebutton} 
        style={{ display:'flex',cursor: disablebutton ? 'not-allowed' :'pointer',minHeight:44, padding:'0 28px', borderRadius:8,background: disablebutton ? '#ccc':'#6366f1', color:'#fff',alignItems:'center', border:0}} 
        onClick={analyze}
         aria-describedby={file ? undefined : 'upload-hint'}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {!file && (
          <p id='upload-hint' style={styles.hint}>
            Please upload a CSV file to analyze.
          </p>
        )}
      </div>
      {error && (
        <p role='alert' style={styles.error}>
          Error:{error}</p>
      )}
      {kpi && (
        <div style={styles.grid}>
          {cards.map(({key,title,unit,color})=>(
            <div key={key} style={{background:'#fff', borderRadius:16,padding:20, borderTop:`8px solid ${color}`, boxShadow:'0 4px 16px rgba(0,0,0,.1)'}}>
              <div style={styles.cardTitle}>
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
