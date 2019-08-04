import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios'

const Series = () => {

    const [data, setData] = useState([])
    useEffect(() => {
        axios
            .get('/api/series')
            .then(res => {
               setData(res.data.data)
            })
    }, [])

    const deleteSerie = id => {
       axios
        .delete('/api/series/' + id)
        .then(res => {
            const filtrado = data.filter(item => item.id !== id)
            setData(filtrado)
        })  
    }

    const renderizaLinha = record => {
        return (
            <tr key={record.id}>
                <th scope="row">{record.id}</th>
                <td>{record.name}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteSerie(record.id)}>Remover</button>
                  <Link className="btn btn-warning" to={'/series/' + record.id}>Informação</Link>
                </td>
            </tr>
        )
    }

    if(data.length === 0) {
        return (
            <div className="container">
                <h1>Séries</h1>
                <Link className="btn btn-primary" to='/series/novo'>Novo Série</Link>
                <div className="alert alert-warning" role="alert">
                    Você não possui séries cadastradas.
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <h1>Série</h1>
            <Link className="btn btn-primary" to='/series/novo'>Novo Série</Link>
            <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map(renderizaLinha)}
            </tbody>
          </table>           
        </div>
    )
}


export default Series