import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import {auth, db} from '../firebase'


const Login = (props) => {

    const [email, setEmail] = useState('edu1@gmail.com')
    const [pass, setPass] = useState('123456')
    const [error, setError] = useState(null)

    const [esRegistro, setEsRegistro] = useState(true)

    const procesarDatos = e => {
        e.preventDefault()
        if(!email.trim()){
            setError('Ingrese Email')
            return
        }
        if(!pass.trim()){
            setError('Ingrese Password')
            return
        }
        if(pass.length < 6){
            setError('Debe ingresar una password con 6 caracteres o más')
            return
        }
        
        console.log('pasa validaciones')
        setError(null)

        if(esRegistro){
            registrar()
        }else{
            login()
        }
    }

    const login = React.useCallback(async () => {
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass)
            console.log(res.user)
            setEmail('')
            setPass('')
            setError(null)
            props.history.push('/admin')
        } catch (error) {
            console.log(error)
            if(error.code === 'auth/invalid-email'){
                setError('Email no válido')
            }
            if(error.code === 'auth/user-not-found'){
                setError('Email no registrado')
            }
            if(error.code === 'auth/wrong-password'){
                setError('Clave incorrecta')
            }

        }
    }, [email, pass, props.history])

    const registrar = React.useCallback(async() => {

        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            await db.collection('usuarios').doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            })
            await db.collection(res.user.uid).add({
                name: 'Tarea de ejemplo',
                fecha: Date.now()
            })
            setEmail('')
            setPass('')
            setError(null)
            props.history.push('/admin')
        } catch (error) {
            console.log(error)
            if(error.code === 'auth/invalid-email'){
                setError('Email no válido')
            }
            if(error.code === 'auth/email-already-in-use'){
                setError('Este Email ya esta registrado')
            }
        }

    }, [email, pass, props.history])
    
    return (
        <div className="mt-5">
           <h3 className="text-center">
               {
                   esRegistro ? 'Registro de usuarios' : 'Login de acceso'
               }
           </h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={procesarDatos}>
                        {
                            error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )
                        }
                        <input
                            type="email" className="form-control"
                            className="form-control mb-2"
                            placeholder="Ingrese email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                        <input
                            type="password" className="form-control"
                            className="form-control mb-2"
                            placeholder="Ingrese password"
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                        />
                        <button className="btn btn-dark btn-lg btn-block" type="submit">
                            {
                                esRegistro ? 'Registrarse' : 'Acceder'
                            }
                        </button>
                        <button 
                            className="btn btn-info btn-sm btn-block"
                            onClick={() => setEsRegistro(!esRegistro)}
                            type="button"
                        >
                            {
                                esRegistro ? '¿Ya estas registrado?' : '¿No tienes Cuenta?'
                            }
                            
                        </button>
                        {
                            !esRegistro ? (
                                <button 
                                className="btn btn-lg btn-danger btn-sm mt-2"
                                type="button"
                                onClick={() => props.history.push('/reset')}
                                >
                                    Recuperar Contraseña
                                </button>
                            ) : null
                        }
                        

                    </form>
                </div>
            </div>
        
        </div>
    )
}

export default withRouter(Login)
