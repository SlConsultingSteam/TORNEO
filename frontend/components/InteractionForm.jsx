import React, { useEffect, useState } from 'react';

const InteractionForm = () => {
  const [initialData, setInitialData] = useState(null);
  const [client, setClient] = useState('');
  const [type, setType] = useState('Estratégica');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [repurchasePotential, setRepurchasePotential] = useState(false);
  const [gifUrl, setGifUrl] = useState('');
  const [gifTitle, setGifTitle] = useState('');

  useEffect(() => {
    if (initialData) {
      setClient(initialData.clientId);
      setType(initialData.type);
      setDate(initialData.date); // Asume que la fecha está en un formato compatible con input type="date"
      setNotes(initialData.notes);
      setRepurchasePotential(initialData.repurchasePotential);
    } else {
      setClient('');
      setType('Estratégica');
      setDate('');
      setNotes('');
      setRepurchasePotential(false);
    }
    const fetchGiphy = async () => {
      try {
        // Giphy integration mejorada
        const response = await fetch('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=celebration&rating=pg');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        let url = '';
        let title = '';
        
        if (data && data.data && data.data.images && data.data.images.original && data.data.images.original.url) {
          url = data.data.images.original.url;
          title = data.data.title || '';
          console.log('GIF de Giphy obtenido:', url);
        } else {
          console.log('Respuesta de Giphy inesperada, usando fallback.', data);
          url = 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif'; // fallback
          title = '';
        }
        setGifUrl(url);
        setGifTitle(title); // Establecer el título del GIF
      } catch (err) {
        console.log('Error al obtener GIF de Giphy:', err);
        setGifUrl('https://media.giphy.com/media/111ebonMs90YLu/giphy.gif');
        setGifTitle(''); // Título vacío para el fallback
      }
    };
    fetchGiphy();
  }, [initialData]); // Dependencia para reinicializar si initialData cambia

  const handleSubmit = async (e) => {
    // ... existing code ...
  };

  return (
    // ... existing code ...
  );
};

export default InteractionForm; 