'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp, Volume2, VolumeX, Mic, MicOff, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import VoiceManager from '@/utils/voiceUtils';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'; // Updated imports
import { Textarea } from "@/components/ui/textarea";
import StarCanvas from "@/components/StarCanvas";
import { UserAvatar } from '@/components/user-avatar';
import { ChatStorage } from '@/app/utils/chat-storage';

interface Message {
  isUser: boolean;
  text: string;
  audio?: string | null;
}

// Mock responses for testing
const mockResponses = [
  "Hello! I'm doing great, thank you for asking. I'm here to help you explore the fascinating world of AI and technology. What would you like to know?",
  "I'm a multi-talented AI assistant with expertise in cybersecurity, blockchain, and decentralized systems. I can help with technical questions, provide guidance on various topics, and even engage in natural conversations with voice responses.",
  "That's a great question! I specialize in natural language processing, voice synthesis, and understanding complex technical concepts. I can help explain difficult topics in simple terms.",
  "I'd be happy to help you with that. My knowledge spans across various domains including AI, machine learning, cybersecurity, and blockchain technology."
];

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const [selectedVoice, setSelectedVoice] = useState<string>('af_bella');
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load saved messages when component mounts
    if (typeof window !== 'undefined') {
      return ChatStorage.loadMessages();
    }
    return [];
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState<{ [key: number]: boolean }>({});
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const voiceManager = useRef(new VoiceManager());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<string>("");
  const { address, isConnected } = useAppKitAccount(); // Updated wallet logic
  const { switchNetwork } = useAppKitNetwork(); // For network switching

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const agent = {
    name: "cyrene",
    image: "/cyrene_profile.png"
  };

  const [autoSlideIndex, setAutoSlideIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSlideIndex((prev) => (prev + 1) % 4);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Self-Replicating AI",
      description: "Autonomous agents capable of seamless task execution and self-replication for enhanced reliability.",
      gradient: "from-blue-400 via-cyan-500 to-teal-600",
      bgGradient: "from-blue-500/20 via-cyan-500/20 to-teal-600/20",
      image: "/self-replicating-ai.jpg",
      fromLeft: true
    },
    {
      title: "Decentralized Infrastructure",
      description: "AI agents and MCP servers are hosted on Erebrus ĐVPN Nodes for secure and verifiable execution.",
      gradient: "from-teal-400 via-cyan-500 to-blue-600",
      bgGradient: "from-teal-500/20 via-cyan-500/20 to-blue-600/20",
      image: "/decentralized-infrastructure.jpg",
      fromLeft: false
    },
    {
      title: "Hyper Coherent Network",
      description: "Multi-agent coordination with real-time precision, fault tolerance and context synchronization.",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
      bgGradient: "from-cyan-500/20 via-blue-500/20 to-indigo-600/20",
      image: "/hyper-coherent-network.jpg",
      fromLeft: true
    },
    {
      title: "Unstoppable Ecosystem",
      description: "Blockchain-backed security with ÐVPN technology ensures resilience.",
      gradient: "from-blue-400 via-indigo-500 to-cyan-600",
      bgGradient: "from-blue-500/20 via-indigo-500/20 to-cyan-600/20",
      image: "/ecosytem.jpg",
      fromLeft: false
    }
  ];

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      setUser(address);
      localStorage.setItem('walletAddress', address);
    } else {
      setWalletAddress(null);
      setUser("");
      localStorage.removeItem('walletAddress');
    }
  }, [isConnected, address]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add this effect to save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      ChatStorage.saveMessages(messages);
    }
  }, [messages]);

  const handleSubmit = async (text: string, user: string, forceVoiceMode?: boolean) => {
    console.log("clicked");
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setTranscription('');

    // Immediately show user message
    const userMessageIndex = messages.length;
    setMessages((prev) => [...prev, { isUser: true, text }]);
    setInputValue('');

    try {
      let responseText: string;
      let audioUrl: string | null = null;

      // Use forced voice mode or current state
      const useVoiceMode = forceVoiceMode || isVoiceMode;
      console.log('Voice mode status:', { forced: forceVoiceMode, current: isVoiceMode, using: useVoiceMode });

      // Get the message response
      const formData = new FormData();
      formData.append('text', text);
      formData.append('userId', user);
      formData.append('voice_mode', useVoiceMode.toString());

      if (agent.name === "cyrene") {
        const response = await fetch(`/api/chatCyrene`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          console.error('Response error:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        responseText = data[0].text;

        if (useVoiceMode) {
          console.log('Voice mode active, generating voice for:', responseText);
          try {
            audioUrl = await voiceManager.current.generateVoice(responseText, selectedVoice);
            console.log('Voice generation result:', audioUrl ? 'success' : 'failed');
            if (audioUrl) {
              console.log('Playing audio...');
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = audioUrl;
                await audioRef.current.play().catch((err) => console.error('Audio playback error:', err));
              } else {
                const audio = new Audio(audioUrl);
                audioRef.current = audio;
                await audio.play().catch((err) => console.error('Audio playback error:', err));
              }
            } else {
              console.error('Voice generation returned null');
            }
          } catch (error) {
            console.error('Voice generation error:', error);
          }
        }

        // Add AI response
        if (!useVoiceMode || audioUrl) {
          setMessages((prev) => [
            ...prev,
            { isUser: false, text: responseText, audio: audioUrl }
          ]);
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setMessages((prev) => prev.filter((_, i) => i !== userMessageIndex));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      voiceManager.current.stopListening();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    voiceManager.current.startListening(
      async (text) => {
        setTranscription(text);
        // Force voice mode to be true for voice input
        const forceVoiceMode = true;
        await handleSubmit(text, user, forceVoiceMode);
      },
      () => setIsRecording(false)
    );
  };

  const exitVoiceMode = () => {
    setIsVoiceMode(false);
    setIsRecording(false);
    voiceManager.current.stopListening();
  };

  const toggleAudio = (index: number) => {
    const message = messages[index];

    if (!message.audio) return;

    if (audioRef.current) {
      // If the same audio is already playing, pause it
      if (isPlayingAudio[index]) {
        audioRef.current.pause();
        setIsPlayingAudio((prev) => ({ ...prev, [index]: false }));
      } else {
        // If a different audio is playing, stop it and play the new one
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = message.audio;
        audioRef.current.play().catch((err) => console.error('Audio playback error:', err));
        setIsPlayingAudio((prev) => ({ ...prev, [index]: true }));
      }
    } else {
      // Create a new audio element if it doesn't exist
      const audio = new Audio(message.audio);
      audioRef.current = audio;
      audio.play().catch((err) => console.error('Audio playback error:', err));
      setIsPlayingAudio((prev) => ({ ...prev, [index]: true }));
    }
  };

  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      exitVoiceMode();
    } else {
      // Set voice mode first
      await new Promise<void>((resolve) => {
        setIsVoiceMode(true);
        setInputValue('');
        resolve();
      });

      // Start listening after state is updated
      setIsRecording(true);
      voiceManager.current.startListening(
        async (text) => {
          setTranscription(text);
          // Force voice mode to be true for first message
          const forceVoiceMode = true;
          await handleSubmit(text, user, forceVoiceMode);
        },
        () => setIsRecording(false)
      );
    }
  };

  return (
    <>
      {/* Background wrapper */}
      <div className="relative w-full overflow-hidden">
        <StarCanvas />
        <div className="absolute inset-0 bg-transparent"></div>

        {/* Your existing content */}
        <div className="relative">
          {/* Hero Section */}
          <div className="relative w-full h-screen">
           
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/10 via-[#0A1A2F]/50 to-black" />
            <div className="absolute inset-0 bg-center" />

            {/* Hero Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-6xl md:text-11xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-200 pb-8"
              >
                LuminaAI
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center"
              >
                <motion.a
                  href="/launch-agent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300"
                >
                  Launch Agent
                </motion.a>
              </motion.div>
            </div>
          </div>

          {/* Chat Section with New Layout */}
          {/*  */}

          {/* Animated Feature Sections */}
          

          {/* Features Section */}
         
        </div>
      </div>
    </>
  );
}