import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'

import { Badge } from 'reactstrap'

import axios from 'axios'

const InfoSerie = ({ match }) => {

    const [ form, setForm ] = useState({
        name: ''
    })
    const [ genres, setGeners ] = useState([])
    const [ genreId, setGenreId ] = useState('')

    const [ success, setSuccess ] = useState(false)
    const [ mode, setMode] = useState('INFO')

    const id = match.params.id

    const onChangeGenre = evt => {
        setGenreId(evt.target.value)
    }

    const onChange = field => evt => {
            setForm({
                ...form, 
                [field]: evt.target.value
        })
    }

    const seleciona = value => () =>{
            setForm({
                ...form, 
                status: value
        })
    }

    const save = () => {
        axios
            .put(`/api/series/${id}`, {
                ...form,
                genre_id: genreId
            })
            .then(res => {
                setSuccess(true)
            })
        }

    const [data, setData] = useState({})
    useEffect(() => {
        axios
            .get(`/api/series/${id}`)
            .then(res => {
                setData(res.data)
                setForm(res.data)
            })           
    }, [id])

    useEffect(() => {
        axios
            .get(`/api/genres`)
            .then(res => {
                setGeners(res.data.data)
                const genres = res.data.data
                const encontrado = genres.find(value => genres.genre === value.name)
                if(encontrado){
                    setGenreId(encontrado.id)
                }
            })            
    }, [id])

    const masterHeader = {
        height: '50vh',
        minHeight: '500px',
        backgroundImage: `url('${data.background}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }

    if(success){
     return <Redirect to='/series'/>
    }

    return (
        <div>
            <pre>{JSON.stringify(data)}</pre>
            <header style={masterHeader}>
                <div className="h-100" style={{background: 'rgba(0,0,0,0,7)'}}>
                    <div className="h-100 container">
                        <div className="row h-100 align-items-center">
                        <div className="col-3">
                            <img src={data.poster} className="img-fluid img-thumbnail" alt={data.name}></img>
                        </div>
                        <div className="col-8">
                            <h1 className="font-weight-light text-white" >{data.name}</h1>
                            <div className="lead text-white">
                                { data.status === 'ASSISTIDO' && <Badge color="success">Assistido</Badge> }
                                { data.status === 'PARA_ASSISTIR' && <Badge color="warning">Para assistir</Badge> }
                                Genêro: {data.genre}
                            </div>
                        </div>
                        </div>                    
                    </div>
                </div>
            </header> 

            <div className='container'>
                <button className="btn btn-primary" onClick={() => setMode('EDIT')}>Editar</button>
            </div>

            { 
                mode === 'EDIT' && 
            
                <div className="container">
                    <h1>Editar Série</h1>
                    
                    <button className="btn btn-primary" onClick={() => setMode('INFO')}>Cancelar Edição</button>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Nome</label>
                            <input type="text" autocomplete="off" value={form.name} onChange={onChange('name')} className="form-control" id="name" placeholder="Nome da Série"/>
                        </div> 
                        <div className="form-group">
                            <label htmlFor="name">Comentários</label>
                            <input type="text" autocomplete="off" value={form.comments} onChange={onChange('comments')} className="form-control" id="comments" placeholder="Comentários da Série"/>
                        </div>                                   
                        <div className="form-group">
                            <label htmlFor="genero">Genêro</label>
                            <select className="form-control" onChange={onChangeGenre} value={genreId}>
                                {genres.map(genre => 
                                    <option key={genre.id} value={genre.id} select={genre.id === form.genre}>
                                        {genre.name}
                                    </option>
                                )}  
                            </select>                            
                        </div>  
                        <div className="form-group">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" checked={form.status === 'ASSISTIDO'} name="status" id="assistido" 
                                       value="ASSISTIDO" 
                                       onChange={seleciona('ASSISTIDO')}/>
                                <label className="form-check-label" htmlFor="status">
                                    Assistido
                                </label>
                            </div>
                            <div className="form-check">
                            <input className="form-check-input" type="radio" checked={form.status === 'PARA_ASSISTIR'} name="status" id="paraAssitir" 
                                   value="PARA_ASSISTIR"
                                   onChange={seleciona('PARA_ASSISTIR')}/>
                            <label className="form-check-label" htmlFor="paraAssitir">
                                Para assistir
                            </label>
                            </div>                                                                    
                        </div>
                        

                        <button type="button" onClick={save} className="btn btn-primary">Salvar</button>           
                    </form>
                </div>
            }   
        </div>



    )
}

export default InfoSerie