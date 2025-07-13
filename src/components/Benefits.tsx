import React from 'react';
import { Clock, TrendingUp, Users, Award } from 'lucide-react';
import './Benefits.css';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Clock />,
      title: 'Save 80% Study Time',
      description: 'Automatically generate summaries and study materials instead of manually rewriting notes.',
      stat: '80%',
      label: 'Time Saved'
    },
    {
      icon: <TrendingUp />,
      title: 'Improve Grades',
      description: 'Better organized notes and AI-generated practice questions lead to improved academic performance.',
      stat: '95%',
      label: 'Success Rate'
    },
    {
      icon: <Users />,
      title: 'Join 5K+ Students',
      description: 'Thousands of students are already using EduVision to enhance their learning experience.',
      stat: '5K+',
      label: 'Active Users'
    },
    {
      icon: <Award />,
      title: 'Proven Results',
      description: 'Students report significant improvement in retention and understanding of study materials.',
      stat: '4.9/5',
      label: 'User Rating'
    }
  ];

  return (
    <section id="benefits" className="benefits section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title animate-fadeInUp">
            Why Students <span className="text-gradient">Love EduVision</span>
          </h2>
          <p className="section-description animate-fadeInUp">
            Join thousands of students who have transformed their study experience with EduVision
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="benefit-card animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="benefit-stat">
                <span className="stat-number">{benefit.stat}</span>
                <span className="stat-label">{benefit.label}</span>
              </div>
              
              <div className="benefit-content">
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
              
              <div className="benefit-glow"></div>
            </div>
          ))}
        </div>

        <div className="testimonial-section animate-fadeInUp">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">
                "EduVision has completely transformed how I study. I can now convert my messy handwritten notes into organized digital content in minutes. The AI-generated summaries and MCQs have helped me improve my grades significantly!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face" alt="Sarah Johnson" />
                </div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Computer Science Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;