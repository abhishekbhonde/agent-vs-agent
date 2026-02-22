import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Debate from './pages/Debate';
import Vote from './pages/Vote';
import Result from './pages/Result';

export default function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col font-sans bg-background text-slate-900">
                <header className="py-6 px-8 border-b border-slate-200 bg-white">
                    <div className="max-w-5xl mx-auto flex items-center justify-between w-full">
                        <h1 className="text-xl font-bold tracking-tight">Agent<span className="text-slate-400 font-normal mx-1">vs</span>Agent</h1>
                        <div className="text-sm font-medium text-slate-500 hidden sm:block">
                            <span className="text-llama">LLaMA 3</span> vs <span className="text-gemini">Gemini</span>
                        </div>
                    </div>
                </header>
                <main className="flex-grow flex flex-col p-4 sm:p-8 max-w-6xl w-full mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/debate" element={<Debate />} />
                        <Route path="/vote" element={<Vote />} />
                        <Route path="/result" element={<Result />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
