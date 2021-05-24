import L from 'leaflet';
import marcador from './marcador.png';
import pin from './pin.jpg'
import avion from './avion.jpg'

export const Marcador = L.icon({
    iconUrl: marcador,
    iconSize: [30 , 30]
  });

export const Pin = L.icon({
    iconUrl: pin,
    iconSize: [30 , 30]
  });

export const Avion = L.icon({
    iconUrl: avion,
    iconSize: [50 , 50]
  });