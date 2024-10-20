'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
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
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: blob.type });
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
          } catch (error) {
            console.error('Fehler beim Laden des Bildes:', error);
          }
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Neues Produkt hinzufügen</h1>
        <Link href="/products" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Zurück zur Übersicht
        </Link>
      </div>
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
          Produkt hinzufügen
        </button>
      </form>
    </div>
  );
}