import React,{useEffect,useState} from 'react'; 
import {createRoot} from 'react-dom/client';

 import './styles.css';

const api=async(path,options={})=>{
  const response=await fetch(path,{...options,
    headers:{'Content-Type':'application/json',
    ...(options.headers||{}),
    ...(localStorage.token?{Authorization:`Bearer ${localStorage.token}`}:{})}}); 
  const data=await response.json().catch(()=>({})); 
  if(!response.ok)throw new Error(data.message||'Request failed');
   return data;
  };

function Auth({onLogin}){
  const [mode,setMode]=useState('login'),
  [form,setForm]=useState({email:'',password:'',name:'',role:'manager'}),
  [error,setError]=useState(''); 
  const submit=async e=>{
    e.preventDefault();
    setError('')
    try{
      const data=await api(`/api/auth/${mode}`,
      {method:'POST',body:JSON.stringify(form)});
      localStorage.token=data.token;
      onLogin(data.user);
    }catch(e){
      setError(e.message)
    }};
       return <main className="auth">
        <div className="auth-card">
          <div className="eyebrow">RENTWISE / KENYA</div>
          <h1>{mode==='login'?'Manage every home.':'Create your workspace.'}
            </h1>
            <p className="muted">A calm operating system for rent, leases and occupancy.
              </p>
              <form onSubmit={submit}>
                {mode==='register'&&<input placeholder="Full name" required value={form.name} 
                onChange={e=>setForm({...form,name:e.target.value})}/>}
                <input type="email" placeholder="Email address" required value={form.email} 
                onChange={e=>setForm({...form,email:e.target.value})}/>
                <input type="password" placeholder="Password (8+ characters)" required minLength="8" value={form.password} 
                onChange={e=>setForm({...form,password:e.target.value})}/>
                {mode==='register'&&<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                  <option value="manager">Property manager</option>
                  <option value="tenant">Tenant</option>
                  </select>}
                  <button>
                    {mode==='login'?'Sign in':'Create account'}
                    </button>
                    </form>
                    {error&&<div className="error">{error}</div>}
                    <button className="link" onClick={()=>setMode(mode==='login'?'register':'login')}>
                      {mode==='login'?'Need an account? Register':'Already have an account? Sign in'}
                      </button>
                      </div>
                      </main>}
function App(){
  const [user,setUser]=useState(null),
  [summary,setSummary]=useState(null),
  [payments,setPayments]=useState([]),
  [error,setError]=useState(''); 
  useEffect(()=>{
    if(localStorage.token)api('/api/auth/me')
      .then(d=>setUser(d.user))
    .catch(()=>localStorage.removeItem('token'))},[]); 

    useEffect(()=>{
      if(user){Promise.all([api('/api/dashboard/summary'),
      api('/api/payments')]).then(([a,b])=>{setSummary(a);
      setPayments(b.payments)})
      .catch(e=>setError(e.message))}},[user]); 

  if(!user)return <Auth onLogin={setUser}/>; 
  const logout=()=>{
    localStorage.removeItem('token');
    setUser(null)};
     return <div className="shell">
      <aside>
        <div className="brand">
          <span>R</span> 
          Rentwise
          </div>
          <nav>
            <a className="active">Overview</a>
              <a>Properties</a>
              <a>Leases</a>
              <a>Payments</a>
              </nav>

              <div className="profile">
                <strong>{user.name}</strong>
                <small>{user.role}</small>
                <button className="logout" onClick={logout}>
                  Sign out
                  </button>
                  </div>
                  </aside>
                  <main className="content">
                    <header>
                      <div>
                        <div className="eyebrow">PORTFOLIO / OVERVIEW</div>
                        <h1>Good morning, {user.name.split(' ')[0]}.</h1>
                        </div>
                        <div className="date">
                          {new Date().toLocaleDateString('en-KE',
                            {weekday:'long',day:'numeric',month:'long'})}
                          </div>
                          </header>
                          {error&&<div className="error">{error}</div>}
                            <section className="hero">
                              <div>
                                <div className="eyebrow light">THIS MONTH</div>
                                <h2>Keep your properties moving.</h2>
                                <p>Track occupancy, leases, and rent collection from one focused view.</p>
                                </div>
                                <div className="hero-mark">⌂</div>
                                </section>
                                <section className="stats">
                                  <Stat label="Properties" value={summary?.properties??'—'}/>
                                  <Stat label="Total units" value={summary?.units??'—'}/>
                                  <Stat label="Occupied" value={summary?.occupiedUnits??'—'}/>
                                  <Stat label="Collected" value={summary?`KES ${Number(summary.collected).toLocaleString()}`:'—'}/>
                                  </section>
                                  <section className="panel">
                                    <div className="panel-head">
                                      <div>
                                      <div className="eyebrow">ACTIVITY</div>
                                      <h3>Recent payments</h3>
                                      </div><span className="pill">{payments.length} records</span>
                                      </div>
                                      {payments.length?<div className="table">
                                        {payments.slice(0,6).map(p=><div className="row" key={p._id}>
                                          <div><strong>{p.mpesaReceiptNumber||'M-Pesa payment'}</strong>
                                          <small>{new Date(p.createdAt).toLocaleDateString('en-KE')}</small>
                                          </div>
                                          <strong>KES {Number(p.amount).toLocaleString()}</strong>
                                          <span className={`status ${p.status.toLowerCase()}`}>{p.status}</span>
                                          </div>)}
                                          </div>:<div className="empty">No payment activity yet. M-Pesa payments will appear here after a callback is received.</div>}
                                          </section>
                                          </main>
                                          </div>}
function Stat({label,value}){
  return 
  <div className="stat"><span>{label}</span>
  <strong>{value}</strong></div>} 
  createRoot(document.getElementById('root')).render(<App/>);
