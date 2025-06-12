import React, { useState, useRef, useEffect } from 'react'

// Cricket Ball Bouncing Animation
const CricketBallLoading = () => (
    <div className="flex items-center space-x-1">
        <div className="w-6 h-6 bg-red-500 rounded-full relative animate-bounce flex items-center justify-center">
            <div className="w-4 h-0.5 bg-white rounded-full absolute"></div>
            <div className="w-0.5 h-4 bg-white rounded-full absolute"></div>
        </div>
        <span className="text-gray-600 text-sm animate-pulse">Thinking...</span>
    </div>
);

// Simple Wicket Animation
const WicketLoading = () => (
    <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
            <div className="w-1 h-8 bg-yellow-600 rounded-full animate-pulse"></div>
            <div className="w-1 h-8 bg-yellow-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-8 bg-yellow-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="text-gray-600 text-sm">Searching cricket data...</span>
    </div>
);

const QueryAnswer = () => {
    const [input, setInput] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat, loading]);

    const handleInput = (e) => setInput(e.target.value);

    const handleSend = async () => {
        if (!input.trim()) return;

        const question = input.trim();
        setChat(prev => [...prev, { type: 'user', text: question }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5001/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });
            const data = await res.json();
            setChat(prev => [...prev, { type: 'bot', text: data.answer || 'No answer found.' }]);
        } catch (e) {
            console.error('Error fetching answer:', e);
            setChat(prev => [...prev, { type: 'bot', text: 'Error fetching answer.' }]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 min-h-60 flex flex-col overflow-hidden'>
            <div className="flex flex-col bg-gradient-to-b from-green-100 to-blue-50 flex-1">

                {/* Chat Area */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-[60vh] overflow-y-auto px-4 py-6">
                        <div className="max-w-2xl mx-auto space-y-4">

                            {/* Welcome State */}
                            {chat.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                            <span className="text-3xl">🏏</span>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Hello Cricket Fan! 👋
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Ask me anything about IPL cricket - teams, players, or matches!
                                    </p>
                                    <div className="flex justify-center space-x-3 text-sm">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">🏆 Teams</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">⭐ Players</span>
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">📊 Stats</span>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            {chat.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-start space-x-2 max-w-lg ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>

                                        {/* Simple Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${msg.type === 'user' ? 'bg-blue-400' : 'bg-green-400'
                                            }`}>
                                            {msg.type === 'user' ? '😊' : '🏏'}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`px-4 py-3 rounded-2xl max-w-sm ${msg.type === 'user'
                                                ? 'bg-blue-500 text-white rounded-br-md'
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Loading Animation */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex items-start space-x-2 max-w-lg">
                                        <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-lg">
                                            🏏
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl bg-white shadow-sm border border-gray-100 rounded-bl-md">
                                            {Math.random() > 0.5 ? <CricketBallLoading /> : <WicketLoading />}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>
                    </div>
                </div>

                {/* Simple Input */}
                <div className="bg-white border-t border-gray-200 px-4 py-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-2">
                            <textarea
                                value={input}
                                onChange={handleInput}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about IPL cricket... 🏏"
                                disabled={loading}
                                rows={1}
                                className="flex-1 px-4 py-2 bg-transparent resize-none focus:outline-none disabled:cursor-not-allowed placeholder-gray-500 text-gray-800"
                                style={{ minHeight: '40px', maxHeight: '100px' }}
                            />

                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 text-center mt-2">
                            Press Enter to send your cricket question
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryAnswer;