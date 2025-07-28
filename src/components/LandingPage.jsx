// LandingPage.jsx – Enhanced Version with Clean Navbar, Neon Poster/Video, Particles.js, Centered Layout
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import '../LandingPage.css';

const cryptoData = [
  { name: 'AES', speed: 95, keySize: 256, secure: '✅' },
  { name: 'Kyber', speed: 88, keySize: 1536, secure: '✅✅' },
  { name: 'ECC', speed: 70, keySize: 256, secure: '❌' },
  { name: 'RSA', speed: 60, keySize: 2048, secure: '❌' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [hacks, setHacks] = useState([]);
  const [hackCount, setHackCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchHacks = () => {
      fetch('https://api.cybersecurityhub.live/today')
        .then(res => res.json())
        .then(data => {
          const incidents = data.latest || [];
          setHacks(incidents);
          setHackCount(incidents.length);
        })
        .catch(() => {
          setHacks([]);
          setHackCount(0);
        });
    };
    fetchHacks();
    const interval = setInterval(fetchHacks, 30000);
    return () => clearInterval(interval);
  }, []);

  const teamRoles = {
    'Keith': 'Lead Developer',
    'Cadence': 'Assistant Developer',
    'Wunglai': 'Tester & Kahoot',
    'Wanyan': 'Slides & Documentation',
  };

  return (
    <div className="landing-page dark-theme">
      <div id="particles-js"></div>

      <nav className="sticky-nav">
        {[ 'info', 'chart', 'slides', 'kahoot', 'poster', 'video', 'hacks', 'team', 'faq', 'test'].map(id => (
          <a href={`#${id}`} key={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</a>
        ))}
      </nav>

      <header className="hero-header animate-fade">
        <h1 className="brand-title">Spectralink</h1>
        <p className="tagline">Quantum-Safe Messaging with Kyber + AES Encryption</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/login')} className="primary-button">Login</button>
          <button onClick={() => navigate('/register')} className="secondary-button">Register</button>
        </div>
      </header>

      <main className="content">
        <section id="info" className="scroll-animate animate-slide">
          <h2>🔐 Why Kyber + AES?</h2>
          <ul className="key-benefits">
            <li><strong>Kyber:</strong> Post-quantum key exchange based on lattice cryptography.</li>
            <li><strong>AES-256:</strong> Proven symmetric encryption, quantum-resistant with long keys.</li>
            <li><strong>Hybrid Model:</strong> Combines speed of symmetric + security of quantum-safe asymmetric.</li>
            <li><strong>NIST Approved:</strong> Kyber selected for standardization in post-quantum cryptography.</li>
          </ul>
        </section>

        <section id="chart" className="scroll-animate animate-slide">
          <h2>📊 Cryptographic Comparison Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cryptoData} layout="vertical" margin={{ left: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 2200]} />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="speed" fill="#00d4ff" name="Speed" />
              <Bar dataKey="keySize" fill="#0077b6" name="Key Size (bits)" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section id="slides" className="scroll-animate animate-slide">
          <h2>📂 Download Slides</h2>
          <ul className="roadmap">
            <li><a href="/assets/Introduction_to_Quantum_Computing updated.pptx" download>📥 Intro to Quantum Computing</a></li>
            <li><a href="/assets/Quantum Algorithms & Cryptographic Impact updated.pptx" download>📥 Quantum Algorithms</a></li>
            <li><a href="/assets/Quantum_Computing_Models updated.pptx" download>📥 QC Models</a></li>
          </ul>
        </section>

        <section id="kahoot" className="scroll-animate animate-slide">
          <h2>🎯 Interactive Kahoot Quizzes</h2>
          <ul className="roadmap">
            <li><a href="https://create.kahoot.it/share/updated-qc-intro/214d716c-a95a-4ee7-97a1-2b43241c0b67" target="_blank">📘 QC Introduction</a></li>
            <li><a href="https://create.kahoot.it/share/updated-qc-model/45a1af6d-afaf-4956-a4a7-f09bb3c36169" target="_blank">🔩 QC Models</a></li>
            <li><a href="https://create.kahoot.it/share/updated-qc-algorithms/1f59e879-bc0a-4c23-9e21-15ee66fe5a52" target="_blank">🧠 QC Algorithms</a></li>
            <li><a href="https://create.kahoot.it/share/updated-qc-pqc/153b809c-e60a-40b2-b84c-af133f422738" target="_blank">🔐 PQ Cryptography</a></li>
          </ul>
        </section>

        <section id="poster" className="scroll-animate animate-zoom">
          <h2>📌 Project Poster</h2>
          <div className="neon-box">
            <img src="/backend/public/assets/poster.jpg" alt="Quantum Poster" className="neon-glow" />
          </div>
        </section>

        <section id="video" className="scroll-animate animate-fade">
          <h2>🎥 Video Explainer</h2>
          <div className="neon-box">
            <video controls className="neon-glow">
              <source src="/assets/quantum_explainer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        <section id="hacks" className="hacks-today scroll-animate animate-slide">
          <h2>🛡️ Real-Time Cyber Incidents</h2>
          <p className="hack-count">🚨 Total Detected Today: <strong>{hackCount}</strong></p>
          <ul>
            {hacks.length ? hacks.map((hack, i) => (
              <li key={i}>{hack.title || 'New attack detected'} – {hack.source || 'Unknown source'}</li>
            )) : <li>Loading incidents or none detected...</li>}
          </ul>
        </section>

        <section id="test" className="scroll-animate animate-slide">
          <h2>🧪 Try the Benchmark Tests</h2>
          <p className="test-description">
            <span className="highlight">Compare encryption performance</span> and simulate <span className="highlight">brute-force attacks</span> in real-time.
          </p>
          <div className="test-buttons">
            <button onClick={() => navigate('/test1')} className="primary-button">🚀 Run Encryption Benchmark</button>
            <button onClick={() => navigate('/test2')} className="primary-button">🔓 Simulate Brute Force</button>
          </div>
        </section>

        <section id="faq" className="faq-section scroll-animate animate-fade">
          <h2>❓ FAQ</h2>
          <div className="faq">
            <div className="faq-item">
              <h4>🔍 Why not RSA or ECC?</h4>
              <p>They are vulnerable to Shor’s algorithm and not safe in a post-quantum era.</p>
            </div>
            <div className="faq-item">
              <h4>🧠 Is AES quantum safe?</h4>
              <p>Yes. AES-256 is resistant to Grover's algorithm due to its key length.</p>
            </div>
            <div className="faq-item">
              <h4>🔐 What is hybrid encryption?</h4>
              <p>It combines Kyber (asymmetric) with AES (symmetric) for speed and quantum safety.</p>
            </div>
          </div>
        </section>

        <section id="team" className="team-section scroll-animate animate-fade">
          <h2>👥 Meet the Developers</h2>
          <div className="team-cards">
            {Object.entries(teamRoles).map(([name, role]) => (
              <div className="card" key={name}>
                <img src="/backend/public/assets/OIP.jpeg" alt={name} />
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer scroll-animate animate-fade">
          <p>© 2025 Spectralink | Quantum-Safe Messaging Initiative</p>
        </footer>
      </main>
    </div>
  );
}