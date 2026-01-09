import { useRef, useCallback, useEffect, useState } from "react";

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}) => {
  const { rate = 0.9, pitch = 1.1, volume = 1 } = options;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer female English voices - look for common female voice names
      const preferredVoices = [
        "Google UK English Female",
        "Google US English",
        "Samantha",
        "Victoria",
        "Karen",
        "Moira",
        "Tessa",
        "Fiona",
        "Microsoft Zira",
        "Microsoft Hazel",
      ];
      
      let selectedVoice = voices.find(v => 
        preferredVoices.some(pv => v.name.includes(pv)) && v.lang.startsWith("en")
      );
      
      // Fallback to any English female-sounding voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.lang.startsWith("en") && 
          (v.name.toLowerCase().includes("female") || 
           v.name.includes("Samantha") ||
           v.name.includes("Karen"))
        );
      }
      
      // Final fallback to first English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
      }
      
      setFemaleVoice(selectedVoice || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [rate, pitch, volume, femaleVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};
