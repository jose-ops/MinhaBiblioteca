import React, { useState, useEffect } from 'react';
import autorService from '../Services/AutorService';

const AutoresList = () => {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarAutores();
  }, []);

  const carregarAutores = async () => {
    try {
      const data = await autorService.listarTodos();
      console.log('Dados recebidos no componente:', data);
      setAutores(data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar autores. Verifique se a API está rodando.');
      setLoading(false);
      console.error('Erro completo:', err);
    }
  };

  if (loading) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <p>Carregando autores...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{padding: '20px', color: 'red', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #d32f2f'}}>
        {error}
      </div>
    );
  }

  return (
    <div style={{padding: '20px', maxWidth: '1000px', margin: '0 auto'}}>
      <h1 style={{color: '#282c34'}}>Lista de Autores</h1>
      <p style={{color: '#666'}}>Total de autores: {autores.length}</p>
      
      {autores.length === 0 ? (
        <p>Nenhum autor cadastrado.</p>
        ) : (
        <div>
          <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '10px'}}>
            <thead>
              <tr>
                <th style={{padding: '12px', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>ID</th>
                <th style={{padding: '12px', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>Nome</th>
                <th style={{padding: '12px', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>Nacionalidade</th>
              </tr>
            </thead>
            <tbody>
              {autores.map((autor, index) => (
                <tr>
                  <td style={{padding: '12px', borderBottom: '1px solid #ddd'}}>{autor.id}</td>
                  <td style={{padding: '12px', borderBottom: '1px solid #ddd'}}>{autor.nome}</td>
                  <td style={{padding: '12px', borderBottom: '1px solid #ddd'}}>{autor.nacionalidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AutoresList;