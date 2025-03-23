import React, { useState, useEffect, useRef } from "react";
import { SupportedLanguages, SupportedLanguageCode } from "../models/languages";
import { TTSPair, saveTTSPair, getTTSPairs, deleteTTSPair } from "../utils/db";

interface Voice extends SpeechSynthesisVoice {
  name: string;
  lang: string;
}

interface LanguagePair {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
}

import { getVoices, speak, stopSpeaking } from "../utils/tts";
import { saveLanguagePairs, getSetting } from "../utils/db";
import { generateLanguagePair, isApiConfigured } from "../utils/api";

function TTSGenerator() {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ja");
  const [sourceVoices, setSourceVoices] = useState<Voice[]>([]);
  const [targetVoices, setTargetVoices] = useState<Voice[]>([]);
  const [selectedSourceVoice, setSelectedSourceVoice] = useState<
    SpeechSynthesisVoice | undefined
  >(undefined);
  const [selectedTargetVoice, setSelectedTargetVoice] = useState<
    SpeechSynthesisVoice | undefined
  >(undefined);
  const [pairs, setPairs] = useState<LanguagePair[]>([]);
  const [ttsPairs, setTTSPairs] = useState<TTSPair[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPairIndex, setCurrentPairIndex] = useState(-1);
  const [rate, setRate] = useState(1);
  const [error, setError] = useState("");
  const [showTTSMenu, setShowTTSMenu] = useState(false);
  const isSpeakingRef = useRef(false);

  // Load available voices and TTS pairs when component mounts
  useEffect(() => {
    // Load saved TTS pairs
    const loadTTSPairs = async () => {
      try {
        const savedPairs = await getTTSPairs();
        setTTSPairs(savedPairs);
      } catch (err) {
        console.error('Error loading TTS pairs:', err);
      }
    };
    
    loadTTSPairs();
    const loadVoices = async () => {
      try {
        const allVoices = await getVoices();
        updateVoicesByLanguage(allVoices, sourceLang, targetLang);
      } catch (err) {
        setError("Failed to load voices. Please try again.");
        console.error("Error loading voices:", err);
      }
    };

    loadVoices();
  }, []);

  // Update voices when language changes
  useEffect(() => {
    const updateVoices = async () => {
      try {
        const allVoices = await getVoices();
        updateVoicesByLanguage(allVoices, sourceLang, targetLang);
      } catch (err) {
        setError("Failed to update voices. Please try again.");
        console.error("Error updating voices:", err);
      }
    };

    updateVoices();
  }, [sourceLang, targetLang]);

  // Helper function to update voices by language
  const updateVoicesByLanguage = (
    allVoices: Voice[],
    source: string,
    target: string
  ) => {
    const sourceVoiceList = allVoices.filter((voice) =>
      voice.lang.includes(source)
    );
    const targetVoiceList = allVoices.filter((voice) =>
      voice.lang.includes(target)
    );

    setSourceVoices(sourceVoiceList);
    setTargetVoices(targetVoiceList);

    // Set default voices if available
    if (sourceVoiceList.length > 0 && !selectedSourceVoice) {
      setSelectedSourceVoice(sourceVoiceList[0] as SpeechSynthesisVoice);
    }

    if (targetVoiceList.length > 0 && !selectedTargetVoice) {
      setSelectedTargetVoice(targetVoiceList[0] as SpeechSynthesisVoice);
    }
  };

  // Generate language pairs from input text
  const generatePairs = async (): Promise<void> => {
    if (!text.trim()) {
      setError("Please enter some text to generate language pairs.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      // Generate translation using API with the entire text
      const translationResult = await generateLanguagePair(
        text.trim(),
        sourceLang as SupportedLanguageCode,
        targetLang as SupportedLanguageCode
      );

      // Process the response which should be in format: source - target
      // Split by lines and parse each line
      const responseLines = translationResult.targetText
        .split("\n")
        .filter((line) => line.trim() !== "");
      
      const newPairs: LanguagePair[] = [...pairs];

      for (const line of responseLines) {
        // Parse the line which should be in format: source - target
        const parts = line.split("-").map(part => part.trim());
        
        if (parts.length >= 2) {
          const sourceText = parts[0];
          // Join the rest in case there are multiple hyphens
          const targetText = parts.slice(1).join(" - ").trim();
          
          const newPair: LanguagePair = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            sourceText,
            targetText,
            sourceLang: sourceLang as LanguagePair["sourceLang"],
            targetLang: targetLang as LanguagePair["targetLang"],
            timestamp: new Date().toISOString(),
          };

          newPairs.push(newPair);
        }
      }

      setPairs(newPairs);

      // Save to IndexedDB
      await saveLanguagePairs(newPairs);

      setText("");
    } catch (err) {
      setError(
        `Failed to generate language pairs: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      console.error("Error generating pairs:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save TTS pair
  const saveTTS = async (text: string, voice: SpeechSynthesisVoice) => {
    try {
      const ttsPair: TTSPair = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        text,
        voice: {
          name: voice.name,
          lang: voice.lang
        },
        rate,
        timestamp: new Date().toISOString()
      };
      
      await saveTTSPair(ttsPair);
      setTTSPairs([...ttsPairs, ttsPair]);
    } catch (err) {
      console.error('Error saving TTS pair:', err);
      setError('Failed to save TTS pair');
    }
  };

  // Speak the current pair
  const speakPair = async (index: number): Promise<void> => {
    if (index < 0 || index >= pairs.length) return;

    let isCurrentlyPlaying = true;
    setCurrentPairIndex(index);
    setIsSpeaking(true);

    // Helper function to speak text with retry logic
    const speakWithRetry = async (
      text: string,
      voice: SpeechSynthesisVoice | undefined,
      maxRetries = 2
    ) => {
      for (let i = 0; i <= maxRetries; i++) {
        try {
          if (!voice) throw new Error("No voice selected");
          await speak(text, voice, rate);
          return; // Success
        } catch (err) {
          if (i === maxRetries) throw err;
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    };

    try {
      // Speak source text and save to IndexedDB
      await speakWithRetry(pairs[index].sourceText, selectedSourceVoice);
      if (selectedSourceVoice) {
        await saveTTS(pairs[index].sourceText, selectedSourceVoice);
      }

      // Add a small pause between source and target
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if we're still playing (not stopped by user)
      if (isCurrentlyPlaying) {
        // Speak target text and save to IndexedDB
        await speakWithRetry(pairs[index].targetText, selectedTargetVoice);
        if (selectedTargetVoice) {
          await saveTTS(pairs[index].targetText, selectedTargetVoice);
        }
      }
    } catch (err) {
      console.error("Detailed speaking error:", err);
      setError(
        `Failed to speak text: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      if (isCurrentlyPlaying) {
        setIsSpeaking(false);
        setCurrentPairIndex(-1);
      }
    }
  };

  // Update the stop speaking handler to set the local flag
  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentPairIndex(-1);
  };

  // Helper function to speak text with retry logic
  const speakWithRetry = async (
    text: string,
    voice: SpeechSynthesisVoice | undefined,
    maxRetries = 2
  ) => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        if (!voice) throw new Error("No voice selected");
        await speak(text, voice, rate);
        return; // Success
      } catch (err) {
        if (i === maxRetries) throw err;
        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  // Speak all pairs sequentially
  const speakAllPairs = async (): Promise<void> => {
    if (!selectedSourceVoice || !selectedTargetVoice) {
      setError('Please select both source and target voices');
      return;
    }

    isSpeakingRef.current = true;
    setIsSpeaking(true);

    try {
      for (let i = 0; i < pairs.length; i++) {
        if (!isSpeakingRef.current) break;
        setCurrentPairIndex(i);

        await speakWithRetry(pairs[i].sourceText, selectedSourceVoice);
        if (!isSpeakingRef.current) break;
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await speakWithRetry(pairs[i].targetText, selectedTargetVoice);
        if (i < pairs.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } catch (err) {
      setError(`Failed to speak: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      setCurrentPairIndex(-1);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Text-to-Speech Generator</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowTTSMenu(!showTTSMenu)}
        >
          {showTTSMenu ? 'Hide TTS Menu' : 'Show TTS Menu'}
        </button>
      </div>

      {showTTSMenu ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Saved TTS Pairs</h3>
          <div className="space-y-4">
            {ttsPairs.map((pair) => (
              <div key={pair.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{pair.text}</p>
                  <p className="text-sm text-gray-600">
                    Voice: {pair.voice.name} ({pair.voice.lang}) - Rate: {pair.rate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      const voice = sourceVoices.find(v => v.name === pair.voice.name) ||
                                  targetVoices.find(v => v.name === pair.voice.name);
                      if (voice) {
                        speak(pair.text, voice, pair.rate);
                      }
                    }}
                  >
                    Play
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={async () => {
                      await deleteTTSPair(pair.id);
                      setTTSPairs(ttsPairs.filter(p => p.id !== pair.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="sourceLang"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Source Language
          </label>
          <select
            id="sourceLang"
            className="select w-full"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            disabled={isSpeaking}
          >
            {/* {
              for(lang in SUPPORTEDLANGUAGES){
                <option value={lang.code}>
                  {lang.name}
                </option>
              }
            } */}
            {SupportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="targetLang"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Target Language
          </label>
          <select
            id="targetLang"
            className="select w-full"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            disabled={isSpeaking}
          >
            {SupportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="sourceVoice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Source Voice
          </label>
          <select
            id="sourceVoice"
            className="select w-full"
            value={selectedSourceVoice ? selectedSourceVoice.name : ""}
            onChange={(e) => {
              const voice = sourceVoices.find((v) => v.name === e.target.value);
              setSelectedSourceVoice(voice);
            }}
            disabled={isSpeaking || sourceVoices.length === 0}
          >
            {sourceVoices.length === 0 ? (
              <option value="">No voices available</option>
            ) : (
              sourceVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="targetVoice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Target Voice
          </label>
          <select
            id="targetVoice"
            className="select w-full"
            value={selectedTargetVoice ? selectedTargetVoice.name : ""}
            onChange={(e) => {
              const voice = targetVoices.find((v) => v.name === e.target.value);
              setSelectedTargetVoice(voice);
            }}
            disabled={isSpeaking || targetVoices.length === 0}
          >
            {targetVoices.length === 0 ? (
              <option value="">No voices available</option>
            ) : (
              targetVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="rate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Speech Rate: {rate.toFixed(1)}
        </label>
        <input
          id="rate"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full"
          disabled={isSpeaking}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Text
        </label>
        <textarea
          id="text"
          className="input w-full h-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate language pairs..."
          disabled={isSpeaking || isGenerating}
        />
      </div>

      <div className="flex justify-end mb-6">
        <button
          className="btn btn-primary"
          onClick={generatePairs}
          disabled={isSpeaking || isGenerating || !text.trim()}
        >
          {isGenerating ? "Generating..." : "Generate Pair"}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">
          Generated Pairs ({pairs.length})
        </h3>

        {pairs.length === 0 ? (
          <p className="text-gray-500 italic">
            No pairs generated yet. Enter text above to get started.
          </p>
        ) : (
          <>
            <div className="flex justify-end mb-3">
              <button
                className="btn btn-secondary"
                onClick={speakAllPairs}
                disabled={isSpeaking || pairs.length === 0}
              >
                {isSpeaking ? "Stop Speaking" : "Speak All Pairs"}
              </button>
            </div>
            <div className="space-y-3">
              {pairs.map((pair, index) => (
                <div
                  key={pair.id}
                  className={`p-3 border rounded-md ${
                    currentPairIndex === index
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{pair.sourceText}</p>
                      <p className="text-gray-600">{pair.targetText}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className={`p-2 rounded-full ${
                          isSpeaking && currentPairIndex === index
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() =>
                          isSpeaking && currentPairIndex === index
                            ? handleStopSpeaking()
                            : speakPair(index)
                        }
                        title={
                          isSpeaking && currentPairIndex === index
                            ? "Stop Speaking"
                            : "Speak"
                        }
                      >
                        {isSpeaking && currentPairIndex === index ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10c0-1.105-.448-2.105-1.172-2.828a1 1 0 010-1.415z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TTSGenerator;
