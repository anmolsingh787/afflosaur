import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

type Message = { id: number; text: string; isUser: boolean; time: string };
type DinoMood = 'happy' | 'excited' | 'cool';

const STORAGE_KEY = 'dino-assistant-messages-v1';

const MOODS: Record<DinoMood, { emoji: string; label: string; bubble: string; userColor: string; header: string }> = {
  happy: {
    emoji: '😊',
    label: 'Happy',
    bubble: 'Deals dhoondhne ke liye ready hoon!',
    userColor: 'bg-orange-100 text-orange-900',
    header: 'bg-orange-500',
  },
  excited: {
    emoji: '🤩',
    label: 'Excited',
    bubble: 'Aaj best offers pakadte hain!',
    userColor: 'bg-pink-100 text-pink-900',
    header: 'bg-pink-500',
  },
  cool: {
    emoji: '😎',
    label: 'Cool',
    bubble: 'Chill mode mein smart shopping!',
    userColor: 'bg-cyan-100 text-cyan-900',
    header: 'bg-cyan-500',
  },
};

const QUICK_ACTIONS = [
  'Best deals today',
  'Trending products',
  'Budget phone suggest karo',
  'Review likhne mein help karo',
];

function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function DinoAssistant() {
  const { isDinoOpen, setDinoOpen, theme } = useApp();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState<DinoMood>('happy');
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentMood = useMemo(() => MOODS[mood], [mood]);

  const getBotReply = (text: string) => {
    const q = text.toLowerCase();
    if (q.includes('deal') || q.includes('offer') || q.includes('price')) return 'Top deals check karo: price compare karke best option lo.';
    if (q.includes('trend')) return 'Trending section me latest hot products mil jayenge.';
    if (q.includes('review')) return 'Review tip: pros, cons, aur final verdict zaroor likho.';
    if (q.includes('prayagraj') || q.includes('local')) return 'Prayagraj ke local options ke liye nearby store deals bhi check karo.';
    return 'Nice! Main isme help kar sakta hoon — thoda aur detail do.';
  };

  const resetMessages = () => {
    const starter: Message = {
      id: Date.now(),
      text: `Hey! I'm Saur ${currentMood.emoji} — deals, trending, reviews sab mein help karunga.`,
      isUser: false,
      time: getTime(),
    };
    setMessages([starter]);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // ignore invalid storage
    }

    setMessages([
      { id: 1, text: "Hey! I'm Saur — ask me about deals or trending products.", isUser: false, time: getTime() },
    ]);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => { if (isDinoOpen) setTimeout(() => inputRef.current?.focus(), 150); }, [isDinoOpen]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text, isUser: true, time: getTime() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const bot: Message = { id: Date.now() + 1, text: getBotReply(text), isUser: false, time: getTime() };
      setMessages(m => [...m, bot]);
      setIsTyping(false);
    }, 700);
  };

  const toggleVoice = () => {
    const SpeechApi = (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition
      || (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechApi) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechApi();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript ?? '';
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed right-4 bottom-20 z-9999 flex flex-col items-end gap-2">
        {!isDinoOpen && (
          <div className={`text-xs px-3 py-1.5 rounded-full shadow border ${isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}>
            {currentMood.bubble}
          </div>
        )}
        <button
          onClick={() => setDinoOpen(!isDinoOpen)}
          className={`w-14 h-14 rounded-full shadow-lg ${currentMood.header} flex items-center justify-center text-2xl transition-transform hover:scale-105 active:scale-95`}
          title="Open Saur"
        >
          🦕
        </button>
      </div>

      {/* Enhanced chat panel */}
      {isDinoOpen && (
        <div className={`fixed right-4 bottom-4 z-9999 w-[360px] max-w-[94%] rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className={`flex items-center justify-between px-4 py-3 ${currentMood.header} text-white`}>
            <div className="font-bold flex items-center gap-2">
              <span>Saur</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={resetMessages} className="p-1 text-xs font-semibold">
                Clear
              </button>
              <button onClick={() => setDinoOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`px-3 py-2 border-b flex gap-2 overflow-x-auto ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            {(Object.keys(MOODS) as DinoMood[]).map((name) => (
              <button
                key={name}
                onClick={() => setMood(name)}
                className={`text-xs px-2.5 py-1.5 rounded-full border whitespace-nowrap ${
                  mood === name
                    ? 'bg-orange-500 text-white border-orange-500'
                    : isDark
                      ? 'border-gray-700 text-gray-200'
                      : 'border-gray-200 text-gray-700'
                }`}
              >
                {MOODS[name].emoji} {MOODS[name].label}
              </button>
            ))}
          </div>

          <div className={`px-3 py-2 border-b flex gap-2 overflow-x-auto ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                className="text-xs px-2.5 py-1.5 rounded-full bg-orange-500 text-white whitespace-nowrap"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="p-3 max-h-[48vh] overflow-y-auto space-y-3">
            {messages.map(m => (
              <div key={m.id} className={m.isUser ? 'text-right' : 'text-left'}>
                <div className={`${m.isUser ? `inline-block ${currentMood.userColor}` : isDark ? 'inline-block bg-gray-800 text-gray-100' : 'inline-block bg-gray-100 text-gray-900'} px-3 py-2 rounded-xl`}>{m.text}</div>
                <div className="text-[10px] text-gray-400 mt-1">{m.time}</div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <div className={`${isDark ? 'inline-block bg-gray-800 text-gray-100' : 'inline-block bg-gray-100 text-gray-900'} px-3 py-2 rounded-xl`}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className={`px-3 py-2 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Say something..."
                className="flex-1 px-3 py-2 rounded-xl border bg-transparent outline-none"
              />
              <button
                onClick={toggleVoice}
                className={`px-3 py-2 rounded-xl ${isListening ? 'bg-red-500' : 'bg-gray-500'} text-white`}
                title="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button onClick={() => sendMessage(input)} className="px-3 py-2 rounded-xl bg-orange-500 text-white">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className={`mt-1 text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {isListening ? 'Listening...' : 'Tip: press mic and speak'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
