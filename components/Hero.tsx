
import React, { useState } from 'react';
import Button from './common/Button';
import Tooltip from './common/Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { CheckIcon } from './icons/CheckIcon';
import { GoogleGenAI } from "@google/genai";

// Define types for form data and errors
interface FormData {
  name: string;
  empresa: string;
  document: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  cidade: string;
  uf: string;
  email: string;
  whatsapp: string;
  password: string;
  confirmPassword: string;
  message: string;
}

interface FormErrors {
  name?: string;
  empresa?: string;
  document?: string;
  cep?: string;
  address?: string;
  number?: string;
  cidade?: string;
  uf?: string;
  email?: string;
  whatsapp?: string;
  password?: string;
  confirmPassword?: string;
}

// Validation helpers
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj === '') return false;
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0,tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0,tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != parseInt(digitos.charAt(1))) return false;
  
  return true;
};

const Hero: React.FC = () => {
  const [docType, setDocType] = useState<'CNPJ' | 'CPF'>('CNPJ');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    empresa: '',
    document: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    cidade: '',
    uf: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Password requirements calculation
  const passwordRequirements = [
    { label: "8+ caracteres", valid: formData.password.length >= 8 },
    { label: "Maiúscula", valid: /[A-Z]/.test(formData.password) },
    { label: "Minúscula", valid: /[a-z]/.test(formData.password) },
    { label: "Número", valid: /[0-9]/.test(formData.password) },
  ];

  const handleAiImprove = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let textToProcess = formData.message;
      if (!textToProcess || textToProcess.trim() === '') {
        textToProcess = "Somos uma empresa integradora de energia solar comprometida em entregar as melhores soluções fotovoltaicas, garantindo economia e sustentabilidade para nossos clientes residenciais e comerciais.";
      }
      
      const prompt = `Você é um especialista em marketing para empresas de energia solar. 
      Reescreva a seguinte descrição de perfil de empresa para torná-la mais profissional, confiável e atraente para clientes que buscam instalação de energia solar.
      Texto original (base): "${textToProcess}"
      
      Instruções:
      - Mantenha o texto em Português do Brasil.
      - Use um tom sério, porém acessível e persuasivo.
      - Destaque benefícios como economia, qualidade técnica e confiança.
      - Limite a resposta a cerca de 300 caracteres.`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, message: response.text.replace(/^"|"$/g, '') }));
      }
    } catch (error) {
      console.error("Erro ao gerar texto com IA", error);
      alert("Não foi possível conectar com a IA no momento.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://solarlink.com.br';
    const text = "Confira a SolarLink: Conecte sua empresa a clientes reais de energia solar!";
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!formData.empresa.trim()) newErrors.empresa = 'O nome da empresa é obrigatório.';
    if (!formData.cidade.trim()) newErrors.cidade = 'A cidade é obrigatória.';
    
    if (!formData.uf) {
      newErrors.uf = 'A UF é obrigatória.';
    } else if (formData.uf.length !== 2) {
      newErrors.uf = 'A UF deve ter 2 letras.';
    } else if (!/^[A-Z]{2}$/.test(formData.uf)) {
      newErrors.uf = 'UF inválida.';
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP obrigatório.';
    } else if (formData.cep.length < 9) {
      newErrors.cep = 'CEP incompleto.';
    }

    if (!formData.address.trim()) newErrors.address = 'Endereço obrigatório.';
    if (!formData.number.trim()) newErrors.number = 'Número obrigatório.';
    
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

    if (!formData.document.trim()) {
        newErrors.document = `O ${docType} é obrigatório.`;
    } else {
        const numbersOnly = formData.document.replace(/\D/g, '');
        if (docType === 'CNPJ') {
            if (!validateCNPJ(numbersOnly)) {
                newErrors.document = 'CNPJ inválido.';
            }
        } else {
            if (!validateCPF(numbersOnly)) {
                newErrors.document = 'CPF inválido.';
            }
        }
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'A senha é obrigatória.';
    } else {
      const allRequirementsMet = passwordRequirements.every(req => req.valid);
      if (!allRequirementsMet) {
        newErrors.password = 'A senha não atende aos requisitos.';
      }
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'whatsapp') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(\d{4})(\d{1,4})/, '$1-$2')
        .slice(0, 15);
    } else if (name === 'cep') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
    } else if (name === 'uf') {
        formattedValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
    } else if (name === 'document') {
        const numbersOnly = value.replace(/\D/g, '');
        if (docType === 'CNPJ') {
          formattedValue = numbersOnly
            .slice(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
        } else { // CPF
          formattedValue = numbersOnly
            .slice(0, 11)
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2');
        }
    }
    
    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name as keyof FormErrors]) {
        setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleDocTypeChange = (type: 'CNPJ' | 'CPF') => {
      if (type !== docType) {
          setDocType(type);
          setFormData(prev => ({ ...prev, document: '' }));
          setErrors(prev => ({ ...prev, document: undefined }));
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setShowSuccess(true);
      setErrors({});
      setFormData({
        name: '',
        empresa: '',
        document: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        cidade: '',
        uf: '',
        email: '',
        whatsapp: '',
        password: '',
        confirmPassword: '',
        message: '',
      });
      setTimeout(() => {
          setShowSuccess(false);
      }, 5000);
    }
  };


  return (
    <section 
      className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden"
    >
      {/* Parallax Background with modern overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545939268-bd45ec41b80e?q=80&w=2000&auto=format&fit=crop')" }}
      ></div>
      
      {/* Gradient Overlays for readability and style */}
      <div className="absolute inset-0 bg-slate-900/40 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-5 text-left text-white space-y-8 animate-fadeIn">
                 <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold text-sm uppercase tracking-wider backdrop-blur-md mb-2">
                    Líder em Conexões Solares
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                    Conecte sua empresa a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm">clientes reais</span>.
                </h1>
                
                <p className="text-lg text-gray-200 leading-relaxed max-w-lg shadow-black drop-shadow-md">
                    Cadastre-se grátis e tenha acesso a oportunidades de instalação fotovoltaica. Sem mensalidade, sem comissão. Você só paga quando decide negociar.
                </p>

                {/* Social Share & Mini CTA */}
                <div className="pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-400 font-medium mb-4 uppercase tracking-wide">Compartilhe esta oportunidade</p>
                    <div className="flex gap-4 mb-6">
                        <button onClick={() => handleShare('facebook')} className="bg-white/10 p-2.5 rounded-lg hover:bg-[#1877F2] hover:text-white text-gray-300 transition-all duration-300 backdrop-blur-sm">
                            <FacebookIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleShare('twitter')} className="bg-white/10 p-2.5 rounded-lg hover:bg-black hover:text-white text-gray-300 transition-all duration-300 backdrop-blur-sm">
                            <TwitterIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleShare('linkedin')} className="bg-white/10 p-2.5 rounded-lg hover:bg-[#0A66C2] hover:text-white text-gray-300 transition-all duration-300 backdrop-blur-sm">
                            <LinkedInIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <a href="#comprar" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors group">
                        Já possui cadastro? Comprar Créditos 
                        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>
            </div>

            {/* Form Content - Glassmorphism Card */}
            <div className="lg:col-span-7">
                <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                    {/* Decorative glow inside card */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">Cadastre sua empresa</h3>
                        <p className="text-gray-400 text-sm mb-6">Junte-se a rede de integradores que mais cresce no país.</p>
                        
                        {showSuccess && (
                            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3 animate-fadeIn backdrop-blur-md">
                                <div className="bg-green-500 rounded-full p-1 flex-shrink-0 shadow-lg">
                                    <CheckIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-white text-sm">Cadastro enviado com sucesso!</h4>
                                    <p className="text-xs text-green-100">Entraremos em contato em breve.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                                <div className="group/input">
                                    <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Seu Nome</label>
                                    <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.name ? 'border-red-500' : 'border-slate-700'}`} 
                                    placeholder="João Silva"
                                    />
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="group/input">
                                    <div className="flex items-center gap-1 mb-1">
                                        <label htmlFor="empresa" className="block text-xs font-medium text-gray-400 group-focus-within/input:text-yellow-400 transition-colors">Nome da Empresa</label>
                                        <Tooltip text="Nome fantasia ou razão social.">
                                            <InfoIcon className="w-3 h-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
                                        </Tooltip>
                                    </div>
                                    <input 
                                    type="text" 
                                    id="empresa" 
                                    name="empresa" 
                                    required 
                                    value={formData.empresa}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.empresa ? 'border-red-500' : 'border-slate-700'}`} 
                                    placeholder="Solar Solutions"
                                    />
                                    {errors.empresa && <p className="text-red-400 text-xs mt-1">{errors.empresa}</p>}
                                </div>

                                <div className="md:col-span-2 group/input">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-medium text-gray-400 group-focus-within/input:text-yellow-400 transition-colors">Documento</label>
                                        <div className="flex bg-slate-800/80 rounded-md p-0.5 border border-slate-700/50">
                                            <button
                                                type="button"
                                                onClick={() => handleDocTypeChange('CNPJ')}
                                                className={`px-3 py-0.5 text-xs rounded transition-all ${docType === 'CNPJ' ? 'bg-yellow-500 text-slate-900 font-bold shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                CNPJ
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDocTypeChange('CPF')}
                                                className={`px-3 py-0.5 text-xs rounded transition-all ${docType === 'CPF' ? 'bg-yellow-500 text-slate-900 font-bold shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                CPF
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        id="document"
                                        name="document"
                                        placeholder={docType === 'CNPJ' ? '00.000.000/0000-00' : '000.000.000-00'}
                                        required
                                        value={formData.document}
                                        onChange={handleChange}
                                        maxLength={docType === 'CNPJ' ? 18 : 14}
                                        className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.document ? 'border-red-500' : 'border-slate-700'}`}
                                    />
                                    {errors.document && <p className="text-red-400 text-xs mt-1">{errors.document}</p>}
                                </div>
                                
                                <div className="md:col-span-2 grid grid-cols-4 gap-4">
                                    <div className="col-span-3 group/input">
                                        <label htmlFor="cidade" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Cidade</label>
                                        <input 
                                            type="text" 
                                            id="cidade" 
                                            name="cidade" 
                                            required 
                                            value={formData.cidade}
                                            onChange={handleChange}
                                            className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.cidade ? 'border-red-500' : 'border-slate-700'}`} 
                                            placeholder="São Paulo"
                                        />
                                        {errors.cidade && <p className="text-red-400 text-xs mt-1">{errors.cidade}</p>}
                                    </div>
                                    <div className="group/input">
                                        <label htmlFor="uf" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">UF</label>
                                        <input 
                                            type="text" 
                                            id="uf" 
                                            name="uf" 
                                            maxLength={2} 
                                            required 
                                            value={formData.uf}
                                            onChange={handleChange}
                                            className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm text-center ${errors.uf ? 'border-red-500' : 'border-slate-700'}`} 
                                            placeholder="SP"
                                        />
                                        {errors.uf && <p className="text-red-400 text-xs mt-1">{errors.uf}</p>}
                                    </div>
                                </div>

                                {/* Address Fields */}
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                   <div className="group/input md:col-span-1">
                                      <label htmlFor="cep" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">CEP</label>
                                      <input 
                                        type="tel" 
                                        id="cep" 
                                        name="cep" 
                                        required 
                                        maxLength={9}
                                        value={formData.cep}
                                        onChange={handleChange}
                                        className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.cep ? 'border-red-500' : 'border-slate-700'}`} 
                                        placeholder="00000-000"
                                      />
                                      {errors.cep && <p className="text-red-400 text-xs mt-1">{errors.cep}</p>}
                                   </div>
                                   <div className="group/input md:col-span-2">
                                      <label htmlFor="address" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Endereço (Rua/Av)</label>
                                      <input 
                                        type="text" 
                                        id="address" 
                                        name="address" 
                                        required 
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.address ? 'border-red-500' : 'border-slate-700'}`} 
                                        placeholder="Av. Paulista"
                                      />
                                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                                   </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                   <div className="group/input md:col-span-1">
                                      <label htmlFor="number" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Número</label>
                                      <input 
                                        type="text" 
                                        id="number" 
                                        name="number" 
                                        required 
                                        value={formData.number}
                                        onChange={handleChange}
                                        className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.number ? 'border-red-500' : 'border-slate-700'}`} 
                                        placeholder="1000"
                                      />
                                      {errors.number && <p className="text-red-400 text-xs mt-1">{errors.number}</p>}
                                   </div>
                                   <div className="group/input md:col-span-2">
                                      <label htmlFor="complement" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Complemento</label>
                                      <input 
                                        type="text" 
                                        id="complement" 
                                        name="complement" 
                                        value={formData.complement}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm"
                                        placeholder="Sala 101, Bloco A"
                                      />
                                   </div>
                                </div>
                                
                                <div className="group/input">
                                    <div className="flex items-center gap-1 mb-1">
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-400 group-focus-within/input:text-yellow-400 transition-colors">E-mail Profissional</label>
                                        <Tooltip text="Importante para notificações.">
                                            <InfoIcon className="w-3 h-3 text-gray-500 hover:text-gray-300 cursor-help" />
                                        </Tooltip>
                                    </div>
                                    <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.email ? 'border-red-500' : 'border-slate-700'}`} 
                                    placeholder="contato@empresa.com"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div className="group/input">
                                    <label htmlFor="whatsapp" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">WhatsApp</label>
                                    <input 
                                    type="tel" 
                                    id="whatsapp" 
                                    name="whatsapp" 
                                    required 
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.whatsapp ? 'border-red-500' : 'border-slate-700'}`} 
                                    placeholder="(11) 99999-9999"
                                    />
                                    {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
                                </div>
                                
                                <div className="group/input">
                                    <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Senha</label>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        required 
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.password ? 'border-red-500' : 'border-slate-700'}`} 
                                        placeholder="••••••••"
                                    />
                                    
                                    <div className="mt-2 grid grid-cols-2 gap-1">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className={`text-[10px] flex items-center gap-1 transition-colors duration-300 ${req.valid ? 'text-green-400' : 'text-gray-500'}`}>
                                                <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${req.valid ? 'border-green-400 bg-green-400/20' : 'border-gray-600'}`}>
                                                    {req.valid && <CheckIcon className="w-2 h-2" />}
                                                </div>
                                                {req.label}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div className="group/input">
                                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Confirmar Senha</label>
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        required 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'}`} 
                                        placeholder="••••••••"
                                    />
                                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                            
                            <div className="my-5 relative group/input">
                                <div className="flex justify-between items-center mb-1">
                                <label htmlFor="message" className="block text-xs font-medium text-gray-400 group-focus-within/input:text-yellow-400 transition-colors">Descrição da Empresa</label>
                                <button 
                                    type="button" 
                                    onClick={handleAiImprove}
                                    disabled={isAiLoading}
                                    className="text-xs flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-500/30 transition-all disabled:opacity-50"
                                >
                                    <SparklesIcon className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                                    {isAiLoading ? 'Gerando...' : 'Melhorar com IA'}
                                </button>
                                </div>
                                <textarea 
                                id="message" 
                                name="message" 
                                rows={3} 
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm text-sm"
                                placeholder="Breve descrição dos seus serviços..."
                                ></textarea>
                            </div>
                            
                            <Button variant="primary" type="submit" className="w-full text-base font-bold py-3.5 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all transform hover:-translate-y-0.5">
                                Finalizar Cadastro Gratuito
                            </Button>
                            
                            <div className="mt-4 text-center">
                                <a href="#como-funciona" className="text-xs text-gray-400 hover:text-white transition-colors border-b border-dashed border-gray-600 hover:border-white pb-0.5">
                                    Como funciona a plataforma?
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
