import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import { Mail, Upload, Send, Instagram } from 'lucide-react';
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_y8i2t8b';
const EMAILJS_TEMPLATE_ID = 'template_orkaeub';
const EMAILJS_PUBLIC_KEY = 'rFzNRld1rTPvJuklw';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'duiwinvef';     // ← reemplazá
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // ← reemplazá (debe ser Unsigned)

const ContactSection = () => {
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
    file: null
  });

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const messageParam = searchParams.get('message');
    if (messageParam) {
      setFormData(prev => ({
        ...prev,
        message: decodeURIComponent(messageParam)
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file: file }));
      setFileName(file.name);
    }
  };

  // Sube el archivo a Cloudinary y devuelve la URL
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('folder', 'contacto-clientes'); // carpeta separada de tus imágenes de tienda

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: 'POST', body: data }
    );

    const result = await res.json();

    if (!res.ok) throw new Error(result.error?.message || 'Error al subir archivo');

    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Si hay archivo, subirlo primero a Cloudinary
      let fileUrl = null;
      if (formData.file) {
        toast.info('Subiendo archivo...');
        fileUrl = await uploadToCloudinary(formData.file);
      }

      const emailParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'No proporcionado',
        service_type: formData.serviceType,
        message: formData.message,
        file_name: fileName || 'Sin archivo adjunto',
        file_url: fileUrl || 'Sin archivo adjunto', // ← URL del archivo en Cloudinary
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams,
        EMAILJS_PUBLIC_KEY
      );

      toast.success('¡Mensaje enviado!', {
        description: 'Te contactaremos pronto por email.'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        message: '',
        file: null
      });
      setFileName('');

    } catch (error) {
      console.error('Error enviando email:', error);
      toast.error('Error al enviar', {
        description: 'Por favor intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  // ... resto del JSX igual que antes, sin cambios
