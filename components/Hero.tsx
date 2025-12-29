
import React, { useState } from 'react';
import Button from './common/Button';
import { CheckIcon } from './icons/CheckIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../lib/supabaseClient';
import { SolarLinkService } from '../lib/solarLinkService'; // Importando o Service
import { getGeminiApiKey } from "../lib/env";
import { UserSession } from '../App';

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

interface HeroProps {
    userSession: UserSession | null;
    setUserSession: (session: UserSession) => void;
    onNavigate: (view: any, param?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ userSession, setUserSession, onNavigate }) => {
  const [step, setStep] = useState<'FORM' | 'REVIEW' | 'SUCCESS'>('FORM');
  const [docType, setDocType] = useState<'CNPJ' | 'CPF'>('CNPJ');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  
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

  const passwordRequirements = [
    { label: "8+ caracteres", valid: formData.password ? formData.password.length >= 8 : false },
    { label: "Maiúscula", valid: formData.password ? /[A-Z]/.test(formData.password) : false },
    { label: "Minúscula", valid: formData.password ? /[a-z]/.test(formData.password) : false },
    { label: "Número", valid: formData.password ? /[0-9]/.test(formData.password) : false },
  ];
  
  const handleAiImprove = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
      let textToProcess = formData.message || "Somos uma empresa integradora de energia solar comprometida em entregar as melhores soluções fotovoltaicas.";
      
      const prompt = `Atue como um especialista em marketing. Reescreva: "${textToProcess}". Destaque: Economia, Qualidade Técnica, Confiança. Máx 300 chars.`;

      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = result.response.text();
      if (text) {
        setFormData(prev => ({ ...prev, message: text.replace(/^"|"$/g, '').trim() }));
      }
    } catch (error) {
      console.error("Erro IA", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (isLoginMode) {
        if (!formData.email) newErrors.email = 'E-mail obrigatório.';
        if (!formData.password) newErrors.password = 'Senha obrigatória.';
        return newErrors;
    }
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!formData.empresa.trim()) newErrors.empresa = 'O nome da empresa é obrigatório.';
    if (!formData.cidade.trim()) newErrors.cidade = 'A cidade é obrigatória.';
    if (!formData.uf || formData.uf.length !== 2) newErrors.uf = 'UF inválida.';
    if (!formData.email) newErrors.email = 'O e-mail é obrigatório.';
    if (!formData.password) newErrors.password = 'A senha é obrigatória.';
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'As senhas não coincidem.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'uf') formattedValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
    setFormData({ ...formData, [name]: formattedValue });
    if (errors[name as keyof FormErrors]) setErrors({ ...errors, [name]: undefined });
  };

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

      setIsProcessing(true);
      try {
          // 1. Auth no Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password
          });

          if (error) throw error;

          // 2. Buscar dados via Service Layer
          const profile = await SolarLinkService.getUserSessionData(data.user.id);

          if (profile && profile.companies) {
              setUserSession({
                  name: profile.full_name,
                  type: 'business',
                  id: data.user.id,
                  details: {
                      companyName: profile.companies.name,
                      credits: profile.companies.credits,
                      companyId: profile.companies.id,
                      role: profile.role
                  }
              });
              onNavigate('home');
          } else {
              alert("Perfil de empresa não encontrado.");
          }

      } catch (error: any) {
          console.error("Login error", error);
          alert("Erro ao entrar: " + error.message);
      } finally {
          setIsProcessing(false);
      }
  };

  // --- REGISTER FLOW ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) return handleLogin(e);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setStep('REVIEW');
  };

  const handleFinalSubmit = async () => {
    setIsProcessing(true);
    try {
        // Usando o Service Layer para o fluxo complexo de cadastro
        const { user, company } = await SolarLinkService.onboardCompany({
            email: formData.email,
            password: formData.password,
            fullName: formData.name,
            companyName: formData.empresa,
            document: formData.document,
            address: { 
                cidade: formData.cidade, 
                uf: formData.uf, 
                cep: formData.cep, 
                rua: formData.address,
                numero: formData.number,
                complemento: formData.complement
            }
        });

        // Atualiza sessão local
        setUserSession({
            name: formData.name,
            type: 'business',
            id: user?.id!,
            details: {
                companyName: company.name,
                credits: company.credits,
                companyId: company.id
            }
        });
        
        setStep('SUCCESS');
        setTimeout(() => { setStep('FORM'); onNavigate('home'); }, 2000);

    } catch (error: any) {
        console.error("Cadastro falhou:", error);
        alert(`Erro: ${error.message}`);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className={`lg:col-span-5 text-left text-white space-y-8 animate-fadeIn ${step !== 'FORM' ? 'hidden lg:block opacity-50 blur-sm transition-all' : ''}`}>
                 <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold text-sm uppercase tracking-wider backdrop-blur-md mb-2">
                    Líder em Conexões Solares
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                    Conecte sua empresa a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">clientes reais</span>.
                </h1>
                <p className="text-lg text-gray-200 leading-relaxed max-w-lg shadow-black drop-shadow-md">
                    Painel completo para integradores.
                </p>
                <div className="flex gap-4">
                    <Button variant="primary" onClick={() => { setIsLoginMode(false); document.getElementById('register-card')?.scrollIntoView({behavior: 'smooth'}); }}>Criar Conta Grátis</Button>
                    <Button variant="outline" onClick={() => onNavigate('home', '#como-funciona')}>Saiba Mais</Button>
                </div>
            </div>

            <div className={`lg:col-span-7 transition-all duration-500 ${step !== 'FORM' ? 'lg:col-start-4 lg:col-span-6' : ''}`} id="register-card">
                {userSession?.type === 'business' ? (
                    <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-yellow-500/30 shadow-2xl animate-slideIn">
                        <div className="flex items-center gap-4 mb-6">
                             <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center">
                                 <BuildingIcon className="w-8 h-8 text-slate-900" />
                             </div>
                             <div>
                                 <h2 className="text-2xl font-bold text-white">{userSession.details?.companyName}</h2>
                                 <p className="text-gray-400">Painel do Parceiro</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                 <p className="text-sm text-gray-400 font-bold uppercase">Saldo</p>
                                 <p className="text-2xl font-bold text-yellow-400">{userSession.details?.credits || 0} Créditos</p>
                             </div>
                             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                 <p className="text-sm text-gray-400 font-bold uppercase">Status</p>
                                 <p className="text-xl font-bold text-green-400">Ativo</p>
                             </div>
                        </div>
                        <Button variant="primary" className="w-full py-3 mb-3" onClick={() => onNavigate('opportunities')}>
                            Buscar Oportunidades
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                             <Button variant="outline" onClick={() => onNavigate('buy_credits')}>Comprar Créditos</Button>
                             <Button variant="outline" onClick={() => onNavigate('user_registration')}>Equipe</Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                        
                        {step === 'FORM' && (
                             <div className="flex justify-end mb-4">
                                 <button 
                                    onClick={() => { setIsLoginMode(!isLoginMode); setErrors({}); }}
                                    className="text-sm text-yellow-400 hover:text-yellow-300 font-medium underline decoration-dotted"
                                 >
                                     {isLoginMode ? 'Criar uma conta nova' : 'Já tenho conta (Entrar)'}
                                 </button>
                             </div>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                                <div className="bg-green-500 rounded-full p-4 shadow-lg mb-6 animate-bounce">
                                    <CheckIcon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Sucesso!</h3>
                                <p className="text-gray-300">Acessando painel...</p>
                            </div>
                        )}

                        {step === 'REVIEW' && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-bold text-white mb-4">Confirmar Dados</h3>
                                <div className="bg-slate-800/50 p-4 rounded-xl mb-4 text-sm text-gray-300 space-y-2">
                                    <p><strong>Empresa:</strong> {formData.empresa}</p>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                    <p><strong>Responsável:</strong> {formData.name}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setStep('FORM')} className="w-1/3">Editar</Button>
                                    <Button variant="primary" onClick={handleFinalSubmit} disabled={isProcessing} className="w-2/3">
                                        {isProcessing ? 'Salvando...' : 'Confirmar Cadastro'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 'FORM' && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {isLoginMode ? 'Acesse seu Painel' : 'Cadastre sua Empresa'}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    {isLoginMode ? 'Entre com suas credenciais.' : 'Junte-se à maior rede de integradores.'}
                                </p>
                                
                                <form onSubmit={handleVerify} noValidate>
                                    {isLoginMode ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-gray-400">E-mail</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-white focus:border-yellow-500 outline-none" placeholder="seu@email.com" />
                                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400">Senha</label>
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-white focus:border-yellow-500 outline-none" placeholder="••••••••" />
                                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                            </div>
                                            <Button variant="primary" type="submit" disabled={isProcessing} className="w-full py-3 mt-2">
                                                {isProcessing ? 'Entrando...' : 'Entrar'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                             <div className="grid grid-cols-2 gap-4">
                                                 <div>
                                                     <label className="text-xs text-gray-400">Seu Nome</label>
                                                     <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Nome" />
                                                     {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                                                 </div>
                                                 <div>
                                                     <label className="text-xs text-gray-400">Empresa</label>
                                                     <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Nome Fantasia" />
                                                     {errors.empresa && <p className="text-red-400 text-xs">{errors.empresa}</p>}
                                                 </div>
                                             </div>
                                             <div>
                                                 <label className="text-xs text-gray-400">E-mail</label>
                                                 <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                                                 {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                                             </div>
                                             <div className="grid grid-cols-2 gap-4">
                                                 <div>
                                                     <label className="text-xs text-gray-400">UF</label>
                                                     <input type="text" name="uf" value={formData.uf} onChange={handleChange} maxLength={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center uppercase" placeholder="SP" />
                                                     {errors.uf && <p className="text-red-400 text-xs">{errors.uf}</p>}
                                                 </div>
                                                 <div>
                                                     <label className="text-xs text-gray-400">Cidade</label>
                                                     <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Cidade" />
                                                     {errors.cidade && <p className="text-red-400 text-xs">{errors.cidade}</p>}
                                                 </div>
                                             </div>
                                             <div>
                                                 <label className="text-xs text-gray-400">Senha</label>
                                                 <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                                             </div>
                                             <div>
                                                 <label className="text-xs text-gray-400">Confirmar Senha</label>
                                                 <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                                             </div>
                                             <Button variant="primary" type="submit" disabled={isProcessing} className="w-full py-3">
                                                {isProcessing ? 'Verificando...' : 'Continuar Cadastro'}
                                             </Button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
