'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Papa from 'papaparse';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type === 'text/csv') {
        Papa.parse(file, {
          complete: (result) => {
            setCsvData(result.data.slice(1)); // Ignoriere die Kopfzeile
            setCurrentProductIndex(0);
          },
          header: true
        });
      } else {
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const onExternalDrop = useCallback((event) => {
    event.preventDefault();
    const items = event.dataTransfer.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'string' && items[i].type.match('^text/plain')) {
        items[i].getAsString(async (url) => {
          try {
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: blob.type });
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
          } catch (error) {
            console.error('Fehler beim Laden des Bildes:', error);
            alert('Fehler beim Laden des Bildes. Bitte versuchen Sie es erneut.');
          }
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (csvData.length > 0) {
      const currentProduct = csvData[currentProductIndex];
      const imagePath = image ? await uploadImage(image) : null;
      
      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name: currentProduct.name, 
          price: parseFloat(currentProduct.price), 
          image: imagePath 
        }]);

      if (error) {
        console.error('Fehler beim Hinzufügen des Produkts:', error);
        alert(`Fehler beim Hinzufügen des Produkts: ${error.message}`);
      } else {
        console.log('Produkt erfolgreich hinzugefügt:', data);
        if (currentProductIndex < csvData.length - 1) {
          setCurrentProductIndex(currentProductIndex + 1);
          setImage(null);
          setPreviewUrl('');
        } else {
          alert('Alle Produkte wurden erfolgreich hinzugefügt!');
          router.push('/products');
        }
      }
    } else {
      if (!name.trim()) {
        alert('Bitte geben Sie einen Produktnamen ein.');
        return;
      }
    
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        alert('Bitte geben Sie einen gültigen Preis ein.');
        return;
      }
    
      const imagePath = image ? await uploadImage(image) : null;
    
      console.log('Versuche, Produkt hinzuzufügen:', { name, price: priceValue, image: imagePath });
    
      const { data, error } = await supabase
        .from('products')
        .insert([{ name, price: priceValue, image: imagePath }]);
    
      if (error) {
        console.error('Fehler beim Hinzufügen des Produkts:', error);
        alert(`Fehler beim Hinzufügen des Produkts: ${error.message}`);
      } else {
        console.log('Produkt erfolgreich hinzugefügt:', data);
        router.push('/products');
      }
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
  
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (uploadError) {
        console.error('Fehler beim Hochladen des Bildes:', uploadError);
        return null;
      }
  
      if (data) {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
  
        console.log('Bild erfolgreich hochgeladen:', urlData.publicUrl);
        return urlData.publicUrl;
      }
    } catch (error) {
      console.error('Unerwarteter Fehler beim Bildupload:', error);
      return null;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Falsches Passwort');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl mb-4">Admin-Bereich</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            className="w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Einloggen
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Neues Produkt hinzufügen</h1>
        <Link href="/products" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Zurück zur Übersicht
        </Link>
      </div>
      {csvData.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">
            Produkt {currentProductIndex + 1} von {csvData.length}
          </h2>
          <p>Name: {csvData[currentProductIndex].name}</p>
          <p>Preis: {csvData[currentProductIndex].price} CHF</p>
          <div>
            <label className="block mb-2">Bild:</label>
            <div 
              {...getRootProps()} 
              onDragOver={onDragOver}
              onDrop={onExternalDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Lassen Sie das Bild hier fallen ...</p>
              ) : (
                <p>Ziehen Sie ein Bild hierher oder klicken Sie, um ein Bild auszuwählen</p>
              )}
            </div>
            {previewUrl && (
              <img src={previewUrl} alt="Vorschau" className="mt-4 max-w-full h-auto" />
            )}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {currentProductIndex < csvData.length - 1 ? 'Nächstes Produkt' : 'Alle Produkte hinzufügen'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="price" className="block mb-2">Preis (CHF):</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Bild oder CSV-Datei:</label>
            <div 
              {...getRootProps()} 
              onDragOver={onDragOver}
              onDrop={onExternalDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Lassen Sie die Datei hier fallen ...</p>
              ) : (
                <p>Ziehen Sie ein Bild oder eine CSV-Datei hierher oder klicken Sie, um eine Datei auszuwählen</p>
              )}
            </div>
            {previewUrl && (
              <img src={previewUrl} alt="Vorschau" className="mt-4 max-w-full h-auto" />
            )}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Produkt hinzufügen
          </button>
        </form>
      )}
    </div>
  );
}