import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './CTA.css';

const CTA: React.FC = () => {
  return (
    <section className="cta section-padding">
      <div className="container">
        <div className="cta-content animate-fadeInUp">
          <div className="cta-background">
            <div className="cta-gradient"></div>
            <div className="cta-pattern"></div>
          </div>
          
          <div className="cta-text">
            <h2 className="cta-title">
              Ready to Transform Your <span className="text-gradient">Study Experience?</span>
            </h2>
            <p className="cta-description">
              Join thousands of students who are already using EduVision to convert their handwritten notes into intelligent study materials. Start your journey to smarter learning today.
            </p>
            
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large">
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary btn-large">
                Try Demo
                <Sparkles size={20} />
              </button>
            </div>
            
            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>Free 14-day trial</span>
              </div>
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          
          <div className="cta-visual">
            <div className="floating-card animate-float">
              <div className="card-content">
                <div className="upload-icon">📤</div>
                <p>Upload Notes</p>
              </div>
            </div>
            
            <div className="floating-card animate-float" style={{ animationDelay: '1s' }}>
              <div className="card-content">
                <div className="ai-icon">🤖</div>
                <p>AI Processing</p>
              </div>
            </div>
            
            <div className="floating-card animate-float" style={{ animationDelay: '2s' }}>
              <div className="card-content">
                <div className="result-icon">📚</div>
                <p>Smart Results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;