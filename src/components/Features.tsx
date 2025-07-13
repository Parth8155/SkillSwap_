import React from 'react';
import { Camera, Brain, FileText, Download, Search, Shield } from 'lucide-react';
import './Features.css';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Camera />,
      title: 'OCR Technology',
      description: 'Advanced optical character recognition that accurately converts handwritten notes to digital text with 95% accuracy.',
      color: '#6366f1'
    },
    {
      icon: <Brain />,
      title: 'AI-Powered Analysis',
      description: 'Smart AI algorithms analyze your notes to generate summaries, key points, and study materials automatically.',
      color: '#8b5cf6'
    },
    {
      icon: <FileText />,
      title: 'Multiple Formats',
      description: 'Generate summaries, MCQs, flashcards, and structured notes from your handwritten content.',
      color: '#ec4899'
    },
    {
      icon: <Download />,
      title: 'Easy Export',
      description: 'Download your processed notes in various formats including PDF, Word, and plain text.',
      color: '#06b6d4'
    },
    {
      icon: <Search />,
      title: 'Smart Search',
      description: 'Find specific information across all your notes with intelligent search and categorization.',
      color: '#10b981'
    },
    {
      icon: <Shield />,
      title: 'Secure Storage',
      description: 'Your notes are encrypted and stored securely with enterprise-grade security measures.',
      color: '#f59e0b'
    }
  ];

  return (
    <section id="features" className="features section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title animate-fadeInUp">
            Powerful Features for <span className="text-gradient">Smart Learning</span>
          </h2>
          <p className="section-description animate-fadeInUp">
            Discover how EduVision transforms your handwritten notes into intelligent study materials
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-hover-effect" style={{ background: feature.color }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;