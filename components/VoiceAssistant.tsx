// components/VoiceAssistant.tsx
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Modal, Text, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice'; // npm install @react-native-voice/voice

// Add your Gemini API key here
const GEMINI_API_KEY = 'AIzaSyAGpymZlLfU70KU9oUjKgsy47POZOjAEec';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$AIzaSyAGpymZlLfU70KU9oUjKgsy47POZOjAEec`;

type Language = 'english' | 'hindi';
type AssistantState = 'idle' | 'greeting' | 'listening' | 'processing' | 'speaking';

const VoiceAssistant = () => {
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [isFirstUse, setIsFirstUse] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState<Language>('english');
  const [transcript, setTranscript] = useState('');
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);

  // Voice recognition setup
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Check voice recognition availability
  useEffect(() => {
  Voice.isAvailable().then((available) => {
    setIsVoiceAvailable(!!available); // Convert 0/1 to false/true
  });
}, []);

  // Voice recognition callbacks
  const onSpeechStart = () => {
    console.log('Speech recognition started');
  };

  const onSpeechRecognized = () => {
    console.log('Speech recognized');
  };

  const onSpeechEnd = () => {
    console.log('Speech recognition ended');
  };

  const onSpeechError = (error: any) => {
    console.log('Speech recognition error:', error);
    setAssistantState('idle');
    speak(
      language === 'hindi' 
        ? 'मुझे आपकी आवाज़ सुनने में समस्या हो रही है। कृपया पुनः प्रयास करें।' 
        : 'I had trouble hearing you. Please try again.'
    );
  };

  const onSpeechResults = (event: any) => {
    const spokenText = event.value[0];
    setTranscript(spokenText);
    processSpeechWithGemini(spokenText);
  };

  const onSpeechPartialResults = (event: any) => {
    const partialText = event.value[0];
    setTranscript(partialText);
  };

  // Greeting messages
  const responses = {
    english: {
      greeting: "Hello! I'm your AI farming assistant powered by advanced intelligence. I can help you with plant health, diseases, pesticides, fertilizers, weather advice, and crop management. Single tap to speak with me, or long press for quick options. What would you like to know about farming?",
      help: "I can help with plant diseases, pest control, fertilizer recommendations, crop management, soil health, irrigation, weather planning, and market advice. Just ask me anything about farming!",
      listening: "I'm listening carefully to your farming question. Please speak clearly...",
      processing: "Let me analyze your question and provide the best farming advice...",
      error: "I couldn't process your request. Please try asking about specific farming topics like plant diseases, pest control, or crop management.",
    },
    hindi: {
      greeting: "नमस्ते! मैं आपकी AI कृषि सहायक हूं जो उन्नत बुद्धिमत्ता से संचालित है। मैं पौधों के स्वास्थ्य, बीमारियों, कीटनाशकों, उर्वरकों, मौसम की सलाह और फसल प्रबंधन में आपकी सहायता कर सकती हूं। बोलने के लिए एक बार टैप करें, या विकल्पों के लिए लॉन्ग प्रेस करें। खेती के बारे में आप क्या जानना चाहते हैं?",
      help: "मैं पौधों की बीमारियों, कीट नियंत्रण, उर्वरक सुझाव, फसल प्रबंधन, मिट्टी के स्वास्थ्य, सिंचाई, मौसम योजना और बाज़ार सलाह में मदद कर सकती हूं। खेती के बारे में मुझसे कुछ भी पूछें!",
      listening: "मैं आपके कृषि प्रश्न को ध्यान से सुन रही हूं। कृपया स्पष्ट रूप से बोलें...",
      processing: "मैं आपके प्रश्न का विश्लेषण कर रही हूं और सर्वोत्तम कृषि सलाह प्रदान कर रही हूं...",
      error: "मैं आपके अनुरोध को संसाधित नहीं कर सकी। कृपया पौधों की बीमारियों, कीट नियंत्रण, या फसल प्रबंधन जैसे विशिष्ट कृषि विषयों के बारे में पूछें।",
    }
  };

  // Speak function with better language support
  const speak = (text: string, callback?: () => void) => {
    if (assistantState === 'speaking') {
      Speech.stop();
    }
    
    setAssistantState('speaking');
    
    const speechOptions = {
      language: language === 'hindi' ? 'hi-IN' : 'en-US',
      rate: 0.8,
      pitch: 1.0,
      onDone: () => {
        setAssistantState('idle');
        if (callback) callback();
      },
      onError: (error: any) => {
        console.log('Speech error:', error);
        setAssistantState('idle');
        if (callback) callback();
      }
    };

    Speech.speak(text, speechOptions);
  };

  // Create farming-focused prompt for Gemini
  const createFarmingPrompt = (userQuestion: string): string => {
    const systemPrompt = language === 'hindi' ? `
आप एक विशेषज्ञ कृषि सलाहकार हैं। किसान के प्रश्न का उत्तर दें:
- व्यावहारिक और क्रियान्वित करने योग्य सलाह दें
- स्थानीय भारतीय कृषि पद्धतियों पर ध्यान दें
- जैविक और रासायनिक दोनों समाधान सुझाएं
- सुरक्षा दिशानिर्देशों को शामिल करें
- उत्तर 2-3 वाक्यों में रखें

किसान का प्रश्न: ${userQuestion}
` : `
You are an expert agricultural advisor. Answer the farmer's question with:
- Practical and actionable advice
- Focus on Indian farming practices
- Suggest both organic and chemical solutions when appropriate
- Include safety guidelines
- Keep response to 2-3 sentences for voice delivery
- Be specific about dosages, timing, and methods

Farmer's question: ${userQuestion}
`;

    return systemPrompt;
  };

  // Call Gemini API
  const callGeminiAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return language === 'hindi' 
        ? 'मुझे आपके प्रश्न का उत्तर देने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।'
        : 'I am having trouble answering your question. Please try again later.';
    }
  };

  // Process speech with Gemini AI
  const processSpeechWithGemini = async (spokenText: string) => {
    if (!spokenText.trim()) {
      speak(
        language === 'hindi' 
          ? 'मुझे कोई प्रश्न सुनाई नहीं दिया। कृपया पुनः प्रयास करें।'
          : 'I did not hear any question. Please try again.'
      );
      return;
    }

    setAssistantState('processing');
    
    try {
      // Speak processing message
      setTimeout(() => {
        speak(
          language === 'hindi' 
            ? responses.hindi.processing
            : responses.english.processing
        );
      }, 500);

      // Create farming-focused prompt
      const prompt = createFarmingPrompt(spokenText);
      
      // Get response from Gemini
      const aiResponse = await callGeminiAPI(prompt);
      
      // Speak the AI response
      setTimeout(() => {
        speak(aiResponse);
      }, 2000);

    } catch (error) {
      console.error('Error processing speech:', error);
      speak(
        language === 'hindi' 
          ? responses.hindi.error
          : responses.english.error
      );
    }
  };

  // Start voice recognition
  const startListening = async () => {
    if (assistantState !== 'idle') return;
    
    if (!isVoiceAvailable) {
      Alert.alert(
        'Voice Recognition Not Available',
        'Voice recognition is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setAssistantState('listening');
      setTranscript('');
      
      // Speak listening message first
      speak(
        language === 'hindi' ? responses.hindi.listening : responses.english.listening,
        async () => {
          // Start voice recognition after speaking
          try {
            await Voice.start(language === 'hindi' ? 'hi-IN' : 'en-US');
          } catch (error) {
            console.error('Error starting voice recognition:', error);
            setAssistantState('idle');
          }
        }
      );
    } catch (error) {
      console.error('Error in startListening:', error);
      setAssistantState('idle');
    }
  };

  // Stop listening
  const stopListening = async () => {
    try {
      await Voice.stop();
      setAssistantState('idle');
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  // Handle single tap
  const handleSingleTap = () => {
    if (assistantState === 'speaking') {
      Speech.stop();
      setAssistantState('idle');
      return;
    }

    if (assistantState === 'listening') {
      stopListening();
      return;
    }

    if (isFirstUse) {
      setIsFirstUse(false);
      speak(
        language === 'hindi' ? responses.hindi.greeting : responses.english.greeting,
        () => {
          // After greeting, start listening
          setTimeout(() => startListening(), 1000);
        }
      );
    } else {
      startListening();
    }
  };

  // Handle long press
  const handleLongPress = () => {
    if (assistantState === 'speaking') {
      Speech.stop();
      setAssistantState('idle');
    }
    setModalVisible(true);
  };

  // Handle quick questions
  const handleQuickQuestion = (question: string) => {
    setModalVisible(false);
    setTranscript(question);
    processSpeechWithGemini(question);
  };

  // Toggle language
  const toggleLanguage = () => {
    const newLanguage = language === 'english' ? 'hindi' : 'english';
    setLanguage(newLanguage);
    speak(
      newLanguage === 'hindi' 
        ? 'भाषा हिंदी में बदल गई है' 
        : 'Language switched to English'
    );
  };

  // Get button appearance based on state
  const getButtonStyle = () => {
    const baseStyle = styles.assistantButton;
    switch (assistantState) {
      case 'listening':
        return [baseStyle, { backgroundColor: '#FF5722' }];
      case 'processing':
        return [baseStyle, { backgroundColor: '#FF9800' }];
      case 'speaking':
        return [baseStyle, { backgroundColor: '#2196F3' }];
      default:
        return [baseStyle, { backgroundColor: '#4CAF50' }];
    }
  };

  const getButtonIcon = () => {
    switch (assistantState) {
      case 'listening':
        return 'radio-button-on';
      case 'processing':
        return 'sync';
      case 'speaking':
        return 'volume-high';
      default:
        return 'mic';
    }
  };

  // Quick question options
  const quickQuestions = {
    english: [
      'My plants have yellow leaves, what should I do?',
      'Which organic pesticide is best for aphids?',
      'How often should I water my tomato plants?',
      'What fertilizer is good for vegetable garden?',
      'How to prevent fungal diseases in monsoon?'
    ],
    hindi: [
      'मेरे पौधों के पत्ते पीले हो रहे हैं, क्या करूं?',
      'माहूं के लिए कौन सा जैविक कीटनाशक सबसे अच्छा है?',
      'टमाटर के पौधों को कितनी बार पानी देना चाहिए?',
      'सब्जी के बगीचे के लिए कौन सा उर्वरक अच्छा है?',
      'मानसून में फफूंदी रोगों को कैसे रोकें?'
    ]
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleSingleTap}
        onLongPress={handleLongPress}
        style={getButtonStyle()}
        activeOpacity={0.8}
      >
        <Ionicons
          name={getButtonIcon()}
          size={32}
          color="white"
        />
        
        {assistantState !== 'idle' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      {/* Transcript bubble */}
      {transcript && (
        <View style={styles.transcriptBubble}>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}

      {/* Options Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {language === 'hindi' ? 'AI कृषि सहायक' : 'AI Farming Assistant'}
            </Text>
            
            <Text style={styles.subtitle}>
              {language === 'hindi' ? 'Gemini AI द्वारा संचालित' : 'Powered by Gemini AI'}
            </Text>

            <View style={styles.languageSection}>
              <Text style={styles.languageText}>
                {language === 'hindi' ? 'भाषा: हिंदी' : 'Language: English'}
              </Text>
              <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
                <Text style={styles.languageButtonText}>
                  {language === 'hindi' ? 'Switch to English' : 'हिंदी में बदलें'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>
              {language === 'hindi' ? 'उदाहरण प्रश्न:' : 'Example Questions:'}
            </Text>

            <View style={styles.questionsContainer}>
              {quickQuestions[language].map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleQuickQuestion(question)}
                  style={styles.questionButton}
                >
                  <Text style={styles.questionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.helpText}>
              {language === 'hindi' 
                ? 'आप कोई भी कृषि संबंधी प्रश्न पूछ सकते हैं। मैं पौधों की देखभाल, बीमारी निदान, कीट नियंत्रण, और फसल प्रबंधन में मदद करूंगी।' 
                : 'You can ask any farming related question. I will help with plant care, disease diagnosis, pest control, and crop management.'}
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>
                {language === 'hindi' ? 'बंद करें' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  assistantButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
  },
  activeIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF1744',
    borderWidth: 3,
    borderColor: 'white',
  },
  transcriptBubble: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  transcriptText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  languageSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontWeight: '500',
  },
  languageButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  languageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionButton: {
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  questionText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 18,
  },
  helpText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VoiceAssistant;