import './App.css';
import React, {useState, useEffect, Component} from 'react';
import io from 'socket.io-client'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Marcador, Pin, Avion } from './iconos.js'

//OJO CON #MAPID EN APP.CSS linea 27

const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl/", {
  path: '/flights'
});


//HACER MAPEO (VUELOS.MAP) PARA MOSTRAR LOS VUELOS EN MAPA
function App() {
  const [state, setState ] = useState({ mensaje: "", nickname: "" })
  const [chat, setChat] = useState([])
  const [vuelos, setVuelos] = useState({ datos: [] })
  const [codigos, setCodigos] = useState([])
  //const [posiciones, setPosiciones] = useState(new Set())
 

  L.Icon.Default.imagePath='./public/img'

  

  useEffect(() => {
    socket.on('connect', () =>{
      console.log('Te has conectado')
      socket.emit('FLIGHTS')
    })
    socket.on('CHAT', ({name, date, message}) =>{
      setChat(chat => [...chat, { mensaje: message, nickname:name } ])
    })
    socket.on('FLIGHTS', (datita) =>{
      datita.map( vuelo => {
        vuelo.position = vuelo.origin
        })
      setVuelos({ datos: datita})
      var codigos = new Set()
      var posiciones = [codigos, []]
      socket.on('POSITION', (data) =>{
        //setPosiciones(posiciones => posiciones.add(data.code))
        codigos.add(data.code)
        datita.map( vuelo => {
          if (vuelo.code===data.code){
            vuelo.position = data.position
          }
        setVuelos({ datos: datita})
          
        })
      })
    })

  }, [])

 

  
  const sendState= (e) =>{
    const { mensaje, nickname} = state
    e.preventDefault()
    socket.emit('CHAT', {name:nickname, message:mensaje})
    setState({ mensaje: "", nickname})
    //console.log(vuelos.datos[3].position)

  };
  
  return (
    <div className="App">
      <h1> Bienvenido a la Tarea 3.</h1>
      <h2>Esta página se divide en tres. Primero está el chat, luego el mapa de los aviones</h2>
      <h2>y por último se encuentra la información de los vuelos</h2>
      <h1> Centro de Control </h1>
      <form onSubmit={sendState}>
        <div></div>
        <input type='text' name="nickname" placeholder='Escriba su nombre'
        value={state.nickname}
        onChange={(e)=>{setState({ ...state, [e.target.name]: e.target.value })}}
        required>
        </input>
        <div></div>
        <input type='text' name="mensaje" placeholder='Escriba su mensaje'
        value={state.mensaje}
        onChange={(e)=>{setState({ ...state, [e.target.name]: e.target.value })}}
        required>
        </input>
        <button type='submit'>Send</button>
      </form>
      <div >
      {chat.map(({ mensaje, nickname }, index)=>{
        return(
          <h3 key={index}> {nickname} <span> {'('} {new Date().toDateString()}{')'}   {': '} {mensaje} </span></h3>
        )
      })}
      </div>
      <div>
      </div>  
      <MapContainer className="map"
        center={[-35,-70]}
        zoom={5}
        scrollWheelZoom={true}
            style={{height:500, width:"100%"}}
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {vuelos.datos.map( (flight, index)=>{
          return(
          <Marker position={flight.position} icon={Avion} key={index}>
            <Popup>
              {flight.code}
            </Popup>
           <Polyline smoothFactor={5} color='red' positions={[flight.origin, flight.position]}></Polyline>
          </Marker>)
        })}
        {vuelos.datos.map( (flight, index)=>{
          return(
          <Marker position={flight.origin} icon={Marcador} key={index}>
            <Polyline smoothFactor={1} positions={[flight.origin, flight.destination]}></Polyline>
          </Marker>)
        })}
        {vuelos.datos.map( (flight, index)=>{
          return(
          <Marker position={flight.destination} icon={Pin} key={index}>
          </Marker>)
        })}


        

        </MapContainer>
      <h2>Información de Vuelos</h2>
      {vuelos.datos.map((flight, index)=>{
        return(
          
          <h3 key={index}> <span> {'Número de Vuelo:'} {flight.code} {'Aerolínea:'} {flight.airline} {'Modelo:'} {flight.plane} {'Asientos'} {flight.seats}</span></h3>
        )
      })}

    </div>  
  );
}

export default App;
