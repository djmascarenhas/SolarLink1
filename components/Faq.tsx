
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import Button from './common/Button';
import { GoogleGenAI } from "@google/genai";

const faqData = [
  {
    question: 'Preciso pagar mensalidade ou comissão?',
    answer: 'Não. A SolarLink não cobra mensalidade nem comissão sobre os serviços fechados. Você só utiliza créditos para acessar os contatos das oportunidades que te interessam.',
  },
  {
    question: 'Como os créditos funcionam?',
    answer: 'Você adquire pacotes de créditos e os utiliza para desbloquear os dados de contato de clientes que publicaram uma oportunidade. Oportunidades diferentes podem ter custos de créditos diferentes.',
  },
  {
    question: 'O que acontece se eu não conseguir contatar o cliente?',
    answer: 'Nós garantimos a qualidade do contato. Se você encontrar um número de telefone inválido, e-mail que não existe ou qualquer outro problema que impeça o primeiro contato, pode solicitar a devolução dos seus créditos para usá-los em outra oportunidade.',
  },
  {
    question: 'Como a SolarLink atrai clientes para a plataforma?',
    answer: 'Investimos em diversas estratégias de marketing digital, como anúncios, SEO (otimização para buscadores) e parcerias para atrair pessoas e empresas que buscam ativamente por serviços de energia solar.',
  },
];

interface FaqItemProps {
  item: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-700">
      <button
        onClick={onClick}
        className="w-full text-left flex justify-between items-center py-5 px-2"
      >
        <h3 className="text-lg font-medium text-white">{item.question}</h3>
        <ChevronDownIcon
          className={`w-6 h-6 text-yellow-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p className="text-gray-400 pb-5 px-2">{item.answer}</p>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [sources, setSources] = useState<{uri: string, title: string}[]>([]);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAsking(true);
    setAiAnswer('');
    setSources([]);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `Você é um assistente virtual inteligente da SolarLink. 
        A SolarLink é uma plataforma que conecta clientes interessados em energia solar com empresas integradoras.
        Regras de negócio da SolarLink:
        1. Não cobramos mensalidade.
        2. Não cobramos comissão sobre vendas.
        3. O integrador compra pacotes de créditos pré-pagos.
        4. O integrador usa créditos para ver os dados de contato do cliente (telefone/email).
        5. Se o contato for inválido, devolvemos os créditos.
        
        Responda a dúvida do usuário com base nessas regras ou sobre energia solar em geral.
        Se necessário, use a ferramenta de busca para encontrar informações atualizadas.
        Seja breve, direto e use um tom prestativo e profissional. Responda em Português.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: aiQuestion,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }],
            }
        });

        if (response.text) {
            setAiAnswer(response.text);
        } else {
            setAiAnswer("Desculpe, não consegui processar sua pergunta agora.");
        }

        // Extract grounding metadata
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            const newSources: {uri: string, title: string}[] = [];
             response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                if (chunk.web?.uri && chunk.web?.title) {
                    newSources.push({ uri: chunk.web.uri, title: chunk.web.title });
                }
            });
            setSources(newSources);
        }

    } catch (error) {
        console.error("Erro na IA", error);
        setAiAnswer("Ocorreu um erro ao conectar com a IA.");
    } finally {
        setIsAsking(false);
    }
  };

  return (
    <section id="faq" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Perguntas Frequentes</h2>
          <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
        </div>

        {/* AI Assistant Section */}
        <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border border-indigo-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-xl font-semibold text-white">Tem uma dúvida específica? Pergunte à nossa IA</h3>
                </div>
                <form onSubmit={handleAskAi} className="flex flex-col md:flex-row gap-2 mb-4">
                    <input 
                        type="text" 
                        placeholder="Ex: Como funciona a devolução de créditos?"
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                    />
                    <Button 
                        type="submit" 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white border-none min-w-[140px] flex justify-center items-center"
                        disabled={isAsking}
                    >
                        {isAsking ? (
                             <SparklesIcon className="w-5 h-5 animate-spin" />
                        ) : 'Perguntar'}
                    </Button>
                </form>
                
                {aiAnswer && (
                    <div className="bg-slate-700/40 p-4 rounded-lg border-l-4 border-indigo-500 animate-fadeIn">
                        <p className="text-gray-200 leading-relaxed">{aiAnswer}</p>
                        
                        {sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-600/50">
                                <p className="text-xs text-gray-400 mb-1 font-medium">Fontes:</p>
                                <ul className="flex flex-wrap gap-2">
                                    {sources.map((source, idx) => (
                                        <li key={idx}>
                                            <a 
                                                href={source.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-900/30 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                            >
                                                {source.title}
                                                <span className="text-[10px] opacity-70">↗</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
