import React from 'react';
import { ArrowRight, Upload, Zap, BookOpen } from 'lucide-react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title animate-fadeInUp">
              Transform Your <span className="text-gradient">Handwritten Notes</span> into Digital Intelligence
            </h1>
            
            <p className="hero-description animate-fadeInUp">
              EduVision uses advanced OCR technology and AI to convert your handwritten notes into structured digital content. Generate summaries, MCQs, and study materials instantly.
            </p>
            
            <div className="hero-buttons animate-fadeInUp">
              <button className="btn btn-primary">
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary">
                Watch Demo
              </button>
            </div>
            
            <div className="hero-stats animate-fadeInUp">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Notes Processed</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Happy Students</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual animate-fadeInRight">
            <div className="hero-card animate-float">
              <div className="card-header">
                <Upload className="card-icon" />
                <span>Upload Notes</span>
              </div>
              <div className="card-content">
                <div className="note-preview">
                  <div className="note-line"></div>
                  <div className="note-line short"></div>
                  <div className="note-line"></div>
                  <div className="note-line medium"></div>
                </div>
              </div>
            </div>
            
            <div className="hero-card animate-float" style={{ animationDelay: '1s' }}>
              <div className="card-header">
                <Zap className="card-icon" />
                <span>AI Processing</span>
              </div>
              <div className="card-content">
                <div className="processing-animation">
                  <div className="processing-bar"></div>
                  <div className="processing-bar"></div>
                  <div className="processing-bar"></div>
                </div>
              </div>
            </div>
            
            <div className="hero-card animate-float" style={{ animationDelay: '2s' }}>
              <div className="card-header">
                <BookOpen className="card-icon" />
                <span>Study Materials</span>
              </div>
              <div className="card-content">
                <div className="output-preview">
                  <div className="output-item">📝 Summary</div>
                  <div className="output-item">❓ MCQs</div>
                  <div className="output-item">📚 Notes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;