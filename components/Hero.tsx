
import React, { useState } from 'react';
import Button from './common/Button';
import Tooltip from './common/Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PencilIcon } from './icons/PencilIcon';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../lib/supabaseClient';

// Define types for form data and errors
interface FormData {
  id?: string; // ID for updates
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

type FormStep = 'FORM' | 'REVIEW' | 'SUCCESS';

const Hero: React.FC = () => {
  const [step, setStep] = useState<FormStep>('FORM');
  const [docType, setDocType] = useState<'CNPJ' | 'CPF'>('CNPJ');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // If user is updating an existing company
  
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
    { label: "8+ caracteres", valid: formData.password ? formData.password.length >= 8 : false },
    { label: "Maiúscula", valid: formData.password ? /[A-Z]/.test(formData.password) : false },
    { label: "Minúscula", valid: formData.password ? /[a-z]/.test(formData.password) : false },
    { label: "Número", valid: formData.password ? /[0-9]/.test(formData.password) : false },
  ];

  const handleAiImprove = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let textToProcess = formData.message;
      if (!textToProcess || textToProcess.trim() === '') {
        textToProcess = "Somos uma empresa integradora de energia solar comprometida em entregar as melhores soluções fotovoltaicas, garantindo economia e sustentabilidade para nossos clientes residenciais e comerciais.";
      }
      
      const prompt = `Atue como um especialista sênior em marketing e copywriting para o setor de energia solar.
      
      Tarefa: Reescreva a descrição da empresa abaixo para torná-la altamente profissional, confiável e persuasiva.
      
      Texto Original: "${textToProcess}"
      
      Requisitos Obrigatórios:
      1. Destaque três pilares principais: Economia Financeira (ROI), Qualidade Técnica Superior (instalação e equipamentos) e Confiança/Segurança.
      2. Tom de voz: Profissional, experiente e focado no cliente.
      3. Limite: Máximo de 300 caracteres.
      4. Idioma: Português do Brasil.
      
      Gere apenas o texto aprimorado, sem aspas ou explicações.`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, message: response.text.replace(/^"|"$/g, '').trim() }));
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

    // Password Validation (Skip if editing and password is empty - meaning no change)
    if (!isEditing || formData.password) {
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

  // Step 1: Validate and Check DB for Existence
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    try {
        // Check if company exists
        const { data: existingCompany, error } = await supabase
            .from('companies')
            .select('*')
            .eq('document', formData.document)
            .single();
        
        if (existingCompany) {
            // Company exists - Switch to Edit Mode
            setIsEditing(true);
            setFormData(prev => ({
                ...prev,
                id: existingCompany.id,
                name: prev.name, // Keep new user name usually, but here we assume company update context
                empresa: existingCompany.name,
                cidade: existingCompany.address?.cidade || prev.cidade,
                uf: existingCompany.address?.uf || prev.uf,
                cep: existingCompany.address?.cep || prev.cep,
                address: existingCompany.address?.rua || prev.address,
                number: existingCompany.address?.numero || prev.number,
                complement: existingCompany.address?.complemento || prev.complement,
                // Email/WhatsApp/Password usually belong to the User Profile, not company root, keeping form input for new user or update
            }));
            alert(`A empresa com ${docType} ${formData.document} já está cadastrada. Os dados foram carregados para edição.`);
        } else {
            setIsEditing(false);
        }

        setStep('REVIEW');
    } catch (err) {
        console.error("Verification error", err);
        // On error (e.g., connection), just proceed to review with what we have
        setStep('REVIEW');
    } finally {
        setIsProcessing(false);
    }
  };

  // Step 2: Final Submit to DB
  const handleFinalSubmit = async () => {
    setIsProcessing(true);
    try {
        let companyId = formData.id;

        // 1. Create or Update Company
        const companyPayload = {
            name: formData.empresa,
            document: formData.document,
            document_type: docType,
            address: {
                rua: formData.address,
                numero: formData.number,
                complemento: formData.complement,
                cidade: formData.cidade,
                uf: formData.uf,
                cep: formData.cep
            }
            // credits not updated here
        };

        if (isEditing && companyId) {
            const { error } = await supabase
                .from('companies')
                .update(companyPayload)
                .eq('id', companyId);
            if (error) throw error;
        } else {
            const { data, error } = await supabase
                .from('companies')
                .insert([ { ...companyPayload, credits: 0 } ])
                .select()
                .single();
            if (error) throw error;
            companyId = data.id;
        }

        // 2. Create User Profile (Admin)
        // Note: In real auth flow, we would check if user email exists first.
        // For this demo, we assume we are adding a user to this company.
        const fakeAuthId = crypto.randomUUID(); 

        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: fakeAuthId, 
                company_id: companyId,
                full_name: formData.name,
                email: formData.email,
                whatsapp: formData.whatsapp,
                role: 'admin'
            }]);

        if (profileError) {
             console.log("User might already exist or error", profileError);
        }

        // 3. Log Audit
        await supabase.from('audit_logs').insert({
            company_id: companyId,
            action: isEditing ? 'company_update' : 'company_registration',
            details: { ip: 'client-side-demo' }
        });

        setStep('SUCCESS');
        setTimeout(() => {
            setStep('FORM'); // Reset after success
            setFormData({
                name: '', empresa: '', document: '', cep: '', address: '', number: '', complement: '',
                cidade: '', uf: '', email: '', whatsapp: '', password: '', confirmPassword: '', message: '',
            });
            setIsEditing(false);
        }, 5000);

    } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Ocorreu um erro ao salvar os dados. Tente novamente.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Content - Hide on Review/Success to focus */}
            <div className={`lg:col-span-5 text-left text-white space-y-8 animate-fadeIn ${step !== 'FORM' ? 'hidden lg:block opacity-50 blur-sm transition-all' : ''}`}>
                 <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold text-sm uppercase tracking-wider backdrop-blur-md mb-2">
                    Líder em Conexões Solares
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                    Conecte sua empresa a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">clientes reais</span>.
                </h1>
                
                <p className="text-lg text-gray-200 leading-relaxed max-w-lg shadow-black drop-shadow-md">
                    Cadastre-se grátis e tenha acesso a oportunidades de instalação fotovoltaica. Sem mensalidade, sem comissão. Você só paga quando decide negociar.
                </p>

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
                </div>
            </div>

            {/* Form Content - Glassmorphism Card */}
            <div className={`lg:col-span-7 transition-all duration-500 ${step !== 'FORM' ? 'lg:col-start-4 lg:col-span-6' : ''}`}>
                <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700"></div>
                    
                    {step === 'SUCCESS' && (
                         <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                             <div className="bg-green-500 rounded-full p-4 shadow-lg mb-6 animate-bounce">
                                 <CheckIcon className="w-10 h-10 text-white" />
                             </div>
                             <h3 className="text-2xl font-bold text-white mb-2">Cadastro Realizado!</h3>
                             <p className="text-gray-300 text-center max-w-sm">
                                 Sua empresa foi {isEditing ? 'atualizada' : 'cadastrada'} com sucesso. Entraremos em contato para validar suas credenciais.
                             </p>
                         </div>
                    )}

                    {step === 'REVIEW' && (
                        <div className="relative z-10 animate-fadeIn">
                            <h3 className="text-2xl font-bold text-white mb-2">Confirmar Dados</h3>
                            <p className="text-gray-400 text-sm mb-6">Verifique se as informações abaixo estão corretas antes de finalizar.</p>

                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Empresa</p>
                                        <p className="text-white font-medium">{formData.empresa}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Documento</p>
                                        <p className="text-white font-medium">{formData.document}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Endereço</p>
                                        <p className="text-white font-medium">{formData.address}, {formData.number} {formData.complement}</p>
                                        <p className="text-white font-medium">{formData.cidade} - {formData.uf}, {formData.cep}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Responsável</p>
                                        <p className="text-white font-medium">{formData.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Contato</p>
                                        <p className="text-white font-medium">{formData.email}</p>
                                        <p className="text-white font-medium">{formData.whatsapp}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Descrição</p>
                                        <p className="text-gray-300 text-sm italic">"{formData.message}"</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setStep('FORM')}
                                    className="w-1/3 flex items-center justify-center gap-2 border-slate-600 text-gray-400 hover:text-white"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    Editar
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleFinalSubmit}
                                    className="w-2/3 flex items-center justify-center gap-2"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <span className="animate-pulse">Salvando...</span>
                                    ) : (
                                        <>
                                            <CheckIcon className="w-4 h-4" />
                                            Confirmar e Salvar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'FORM' && (
                        <div className="relative z-10 animate-fadeIn">
                            <h3 className="text-2xl font-bold text-white mb-2">Cadastre sua empresa</h3>
                            <p className="text-gray-400 text-sm mb-6">Junte-se a rede de integradores que mais cresce no país.</p>
                            
                            <form onSubmit={handleVerify} noValidate>
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
                                            <div className="flex items-center gap-1">
                                                <label className="block text-xs font-medium text-gray-400 group-focus-within/input:text-yellow-400 transition-colors">Documento</label>
                                                <Tooltip text={docType === 'CNPJ' ? 'Formato: XX.XXX.XXX/XXXX-XX' : 'Formato: XXX.XXX.XXX-XX'}>
                                                    <InfoIcon className="w-3 h-3 text-gray-500 hover:text-gray-300 cursor-help" />
                                                </Tooltip>
                                            </div>
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
                                            required={!isEditing}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.password ? 'border-red-500' : 'border-slate-700'}`} 
                                            placeholder={isEditing ? "(Deixe em branco para não alterar)" : "••••••••"}
                                        />
                                        
                                        {/* Enhanced Password Feedback - Only show if typing or not editing */}
                                        {(formData.password || !isEditing) && (
                                            <div className="mt-2 space-y-2">
                                                {formData.password && (
                                                    <div className="flex gap-1 h-1">
                                                        {[1, 2, 3, 4].map((step) => (
                                                            <div 
                                                                key={step} 
                                                                className={`flex-1 rounded-full transition-all duration-300 ${
                                                                    passwordRequirements.filter(r => r.valid).length >= step 
                                                                    ? (passwordRequirements.every(r => r.valid) ? 'bg-green-500' : 'bg-yellow-500')
                                                                    : 'bg-slate-700'
                                                                }`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                <div className="grid grid-cols-2 gap-1">
                                                    {passwordRequirements.map((req, index) => (
                                                        <div key={index} className={`text-[10px] flex items-center gap-1.5 transition-colors duration-300 ${req.valid ? 'text-green-400 font-medium' : 'text-gray-500'}`}>
                                                            <div className={`w-3 h-3 rounded-full flex items-center justify-center border transition-all ${req.valid ? 'border-green-400 bg-green-400/20' : 'border-slate-600 bg-transparent'}`}>
                                                                {req.valid && <CheckIcon className="w-2 h-2" />}
                                                            </div>
                                                            {req.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                    </div>
                                    <div className="group/input">
                                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-400 mb-1 group-focus-within/input:text-yellow-400 transition-colors">Confirmar Senha</label>
                                        <input 
                                            type="password" 
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            required={!isEditing}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none backdrop-blur-sm ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'}`} 
                                            placeholder={isEditing ? "(Deixe em branco para não alterar)" : "••••••••"}
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
                                    {isProcessing ? 'Verificando...' : 'Finalizar Cadastro Gratuito'}
                                </Button>
                                
                                <div className="mt-4 text-center">
                                    <a href="#como-funciona" className="text-xs text-gray-400 hover:text-white transition-colors border-b border-dashed border-gray-600 hover:border-white pb-0.5">
                                        Como funciona a plataforma?
                                    </a>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
