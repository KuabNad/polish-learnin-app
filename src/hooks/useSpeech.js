import { useState, useEffect, useCallback } from 'react';

export const useSpeech = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
      
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };

      window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices();
    }
  }, []);

  const speak = useCallback((text, lang = 'pl-PL') => {
    if (!supported) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Try to find a specific voice for the language
    // Polish voices often need to be explicitly selected if multiple exist
    const voice = voices.find(v => v.lang.includes(lang.split('-')[0])); // Match 'pl' in 'pl-PL'
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [supported, voices]);

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return { speak, cancel, speaking, supported };
};
