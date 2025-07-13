import React from 'react';
import { Upload, Scan, Sparkles, Download } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Upload />,
      title: 'Upload Your Notes',
      description: 'Simply take a photo or upload an image of your handwritten notes. Our system supports multiple image formats.',
      step: '01'
    },
    {
      icon: <Scan />,
      title: 'OCR Processing',
      description: 'Our advanced OCR technology scans and converts your handwritten text into digital format with high accuracy.',
      step: '02'
    },
    {
      icon: <Sparkles />,
      title: 'AI Enhancement',
      description: 'AI algorithms analyze the content and generate summaries, MCQs, key points, and structured study materials.',
      step: '03'
    },
    {
      icon: <Download />,
      title: 'Download & Study',
      description: 'Access your enhanced notes, export in various formats, and use the generated study materials for better learning.',
      step: '04'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title animate-fadeInUp">
            How <span className="text-gradient">EduVision</span> Works
          </h2>
          <p className="section-description animate-fadeInUp">
            Transform your handwritten notes into digital intelligence in just four simple steps
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item animate-fadeInUp" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <div className="step-icon">
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        <div className="demo-section animate-fadeInUp">
          <div className="demo-card">
            <h3>See It In Action</h3>
            <p>Watch how EduVision transforms handwritten notes into structured digital content</p>
            <button className="btn btn-primary">
              Try Demo
              <Sparkles size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;