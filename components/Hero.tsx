import React, { useState } from 'react';
import Button from './common/Button';

// Define types for form data and errors
interface FormData {
  name: string;
  empresa: string;
  cidade: string;
  uf: string;
  email: string;
  whatsapp: string;
  message: string;
}

interface FormErrors {
  name?: string;
  empresa?: string;
  cidade?: string;
  uf?: string;
  email?: string;
  whatsapp?: string;
}

const Hero: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    empresa: '',
    cidade: '',
    uf: '',
    email: '',
    whatsapp: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!formData.empresa.trim()) newErrors.empresa = 'O nome da empresa é obrigatório.';
    if (!formData.cidade.trim()) newErrors.cidade = 'A cidade é obrigatória.';
    
    if (!formData.uf) {
      newErrors.uf = 'A UF é obrigatória.';
    } else if (!/^[A-Z]{2}$/i.test(formData.uf)) {
      newErrors.uf = 'UF inválida (ex: SP).';
    }
    
    if (!formData.email) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de e-mail inválido.';
    }
    
    if (!formData.whatsapp) {
      newErrors.whatsapp = 'O WhatsApp é obrigatório.';
    } else if (formData.whatsapp.replace(/\D/g, '').length < 10) {
        newErrors.whatsapp = 'Número inválido.';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'whatsapp') {
      // Auto-formatting for WhatsApp number as (XX) XXXXX-XXXX
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(\d{4})(\d{1,4})/, '$1-$2') // handles 8 and 9 digit numbers
        .slice(0, 15);
    } else if (name === 'uf') {
        formattedValue = value.toUpperCase().slice(0, 2);
    }
    
    setFormData({ ...formData, [name]: formattedValue });

    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
        setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Form submitted successfully:', formData);
      // Here you would typically send the data to a server
      alert('Cadastro enviado com sucesso!');
      setErrors({});
      // Optional: clear form after successful submission
      setFormData({
        name: '',
        empresa: '',
        cidade: '',
        uf: '',
        email: '',
        whatsapp: '',
        message: '',
      });
    }
  };


  return (
    <section 
      className="relative py-20 md:py-24 bg-cover bg-center" 
      style={{ backgroundImage: "url('https://picsum.photos/1600/900?grayscale&blur=2&random=1')" }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
          SolarLink — Conecte sua empresa a <span className="text-yellow-400">clientes reais</span>.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-6">
          Cadastre-se grátis em minutos e responda oportunidades com créditos — sem mensalidade e sem comissão.
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-200 mb-8">
          Mais visibilidade. Mais propostas. Todo o retorno para você.
        </h2>
        
        {/* Contact Form */}
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 md:p-8 max-w-4xl mx-auto rounded-xl border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Cadastre sua empresa — é grátis</h3>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 mb-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 text-left">Seu Nome</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          placeholder="João Silva" 
                          required 
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full bg-slate-700/50 border rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 transition ${errors.name ? 'border-red-500' : 'border-slate-600'}`} 
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1 text-left">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="empresa" className="block text-sm font-medium text-gray-300 mb-1 text-left">Nome da Empresa</label>
                        <input 
                          type="text" 
                          id="empresa" 
                          name="empresa" 
                          placeholder="Soluções Solar Ltda" 
                          required 
                          value={formData.empresa}
                          onChange={handleChange}
                          className={`w-full bg-slate-700/50 border rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 transition ${errors.empresa ? 'border-red-500' : 'border-slate-600'}`} 
                        />
                        {errors.empresa && <p className="text-red-400 text-xs mt-1 text-left">{errors.empresa}</p>}
                    </div>
                    
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">
                      <div className="md:col-span-3">
                          <label htmlFor="cidade" className="block text-sm font-medium text-gray-300 mb-1 text-left">Cidade</label>
                          <input 
                            type="text" 
                            id="cidade" 
                            name="cidade" 
                            placeholder="São Paulo" 
                            required 
                            value={formData.cidade}
                            onChange={handleChange}
                            className={`w-full bg-slate-700/50 border rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 transition ${errors.cidade ? 'border-red-500' : 'border-slate-600'}`} 
                          />
                          {errors.cidade && <p className="text-red-400 text-xs mt-1 text-left">{errors.cidade}</p>}
                      </div>
                      <div>
                          <label htmlFor="uf" className="block text-sm font-medium text-gray-300 mb-1 text-left">UF</label>
                          <input 
                            type="text" 
                            id="uf" 
                            name="uf" 
                            placeholder="SP" 
                            maxLength={2} 
                            required 
                            value={formData.uf}
                            onChange={handleChange}
                            className={`w-full bg-slate-700/50 border rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 transition ${errors.uf ? 'border-red-500' : 'border-slate-600'}`} 
                          />
                          {errors.uf && <p className="text-red-400 text-xs mt-1 text-left">{errors.uf}</p>}
                      </div>
                    </div>
                    
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 text-left">E-mail</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          placeholder="joao.silva@email.com" 
                          required 
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full bg-slate-700/50 border rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 transition ${errors.email ? 'border-red-500' : 'border-slate-600'}`} 
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1 text-left">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-1 text-left">WhatsApp</label>
                        <input 
                          type="tel" 
                          id="whatsapp" 
                          name="whatsapp" 
                          placeholder="(11) 99999-9999" 
                          required 
                          value={formData.whatsapp}
                          onChange={handleChange}
                          className={`w-full bg-slate-700/50 border rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 transition ${errors.whatsapp ? 'border-red-500' : 'border-slate-600'}`} 
                        />
                        {errors.whatsapp && <p className="text-red-400 text-xs mt-1 text-left">{errors.whatsapp}</p>}
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1 text-left">Mensagem (opcional)</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={4} 
                      placeholder="Fale um pouco sobre sua empresa ou especialidade." 
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 transition"
                    ></textarea>
                </div>
                <Button variant="primary" type="submit" className="w-full text-lg py-3">
                  Enviar Cadastro
                </Button>
            </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;