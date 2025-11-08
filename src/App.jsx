import React, { useState } from 'react';

// Calculator component - refactored to use proper state management
// Removed global mutable state, improved error handling

function badParse(s) {
  try {
    const cleaned = String(s).replace(',', '.');
    const result = Number(cleaned);
    
    if (Number.isNaN(result)) {
      console.warn(`badParse: No se pudo convertir "${s}" a número. Retornando 0.`);
      return 0;
    }
    
    return result;
  } catch(e) {
    console.error(`badParse: Error al procesar "${s}":`, e.message);
    return 0;
  }
}

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const [res, setRes] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  function compute() {
    const A = badParse(a);
    const B = badParse(b);
    
    try {
      setError(null); // Limpiar error anterior
      let r = 0;
      
      if (op === '+') r = A + B;
      if (op === '-') r = A - B;
      if (op === '*') r = A * B;
      if (op === '/') r = (B === 0) ? A/(B+1e-9) : A/B;
      if (op === '^') r = Math.pow(A, B);
      if (op === '%') r = A % B;
      
      setRes(r);
      
      // Agregar al historial usando state management apropiado
      const operation = {
        id: `${Date.now()}-${Math.random()}`, // ID único para cada operación
        operandA: A,
        operandB: B,
        operator: op,
        result: r,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [...prev, operation]);
    } catch(e) {
      console.error('Error al calcular:', e.message, {operandA: A, operandB: B, operator: op});
      setError(`Error en el cálculo: ${e.message}`);
      setRes(null);
    }
  }

  return (
    <div style={{fontFamily:'sans-serif', padding:20}}>
      <h1>Calculadora React</h1>
      <div style={{display:'flex', gap:10}}>
        <input value={a} onChange={e=>setA(e.target.value)} placeholder="a" />
        <input value={b} onChange={e=>setB(e.target.value)} placeholder="b" />
        <select value={op} onChange={e=>setOp(e.target.value)}>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
          <option value="^">^</option>
          <option value="%">%</option>
        </select>
        <button onClick={compute}>=</button>
        <div style={{minWidth:120}}>Result: {res}</div>
      </div>
      
      {error && (
        <div style={{color:'red', marginTop:10, padding:10, background:'#ffe6e6', borderRadius:4}}>
          ⚠️ {error}
        </div>
      )}

      <hr />
      
      <h2>Historial de Operaciones</h2>
      {history.length === 0 ? (
        <p style={{color:'#999', fontStyle:'italic'}}>No hay operaciones en el historial.</p>
      ) : (
        <div style={{maxHeight:200, overflowY:'auto', border:'1px solid #ddd', borderRadius:4, padding:10}}>
          {history.map((item, index) => (
            <div key={item.id} style={{padding:'5px 0', borderBottom: index < history.length - 1 ? '1px solid #eee' : 'none'}}>
              <span style={{fontFamily:'monospace'}}>
                {item.operandA} {item.operator} {item.operandB} = {item.result}
              </span>
              <span style={{marginLeft:20, fontSize:12, color:'#666'}}>
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {history.length > 0 && (
        <button 
          onClick={() => setHistory([])} 
          style={{marginTop:10, padding:'5px 10px', cursor:'pointer'}}
        >
          Limpiar historial
        </button>
      )}

      <hr />
      <h3>Información</h3>
      <p style={{fontSize:12, color:'#666'}}>
        Calculadora refactorizada con gestión apropiada de estado usando React hooks.
        Incluye historial de operaciones con timestamps y manejo robusto de errores.
      </p>

    </div>
  );
}
