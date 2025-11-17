'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      setBookCount(JSON.parse(savedBooks).length);
    }
  }, []);

  return (
    <div className="min-vh-100 position-relative overflow-hidden" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff5f8 50%, #f0f9ff 100%)'}}>
      <nav className="navbar navbar-light bg-white shadow-sm position-relative" style={{zIndex: 10}}>
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '8px 20px',
              borderRadius: '20px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              📚 Liberia
            </div>
          </Link>
          <div className="d-flex gap-3">
            <Link href="/explore" className="btn btn-outline-primary px-4" style={{borderRadius: '25px', fontWeight: '600'}}>
              Explore More
            </Link>
          </div>
        </div>
      </nav>

      <div className="position-relative" style={{zIndex: 1}}>
        <div className="container pt-4">
          <div className={`card border-0 shadow-sm mb-4 hover-card-smooth ${isLoaded ? 'fade-in-up' : ''}`} style={{
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="fw-bold mb-2" style={{color: '#2c3e50'}}>
                    👤 Student Information
                  </h5>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <small className="text-muted d-block mb-1">Name</small>
                      <p className="mb-0 fw-semibold">Kathleen Klavinka Kurniawan</p>
                    </div>
                    <div className="col-sm-3">
                      <small className="text-muted d-block mb-1">NIM</small>
                      <p className="mb-0 fw-semibold">535240125</p>
                    </div>
                    <div className="col-sm-3">
                      <small className="text-muted d-block mb-1">Topic</small>
                      <p className="mb-0 fw-semibold">Reading Tracker</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-4">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className={isLoaded ? 'fade-in-up' : ''}>
                <h1 className="display-3 fw-bold mb-4" style={{color: '#2c3e50'}}>
                  Your Personal<br/>Book Library
                </h1>
                <p className="lead mb-4" style={{color: '#555'}}>
                  Take your reading journey to the next level. Track, organize, and discover your favorite books all in one beautiful place.
                </p>
                <Link href="/books" className="btn btn-primary btn-lg px-5 py-3 glow-button" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  transition: 'all 0.3s ease'
                }}>
                  Discover Your Library →
                </Link>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="position-relative">
                <div className={`text-center position-relative ${isLoaded ? 'float-animation' : ''}`} style={{zIndex: 1}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="currentColor" className="bi bi-book-half" viewBox="0 0 16 16" style={{
                    filter: 'drop-shadow(0 10px 30px rgba(102, 126, 234, 0.3))'
                  }}>
                    <defs>
                      <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path fill="url(#bookGradient)" d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm h-100 hover-card ${isLoaded ? 'fade-in-up-delay-1' : ''}`} style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ffd6e8 0%, #ffc4d6 100%)'
              }}>
                <div className="card-body p-4">
                  <div className="display-4 mb-3">📚</div>
                  <h3 className="fw-bold mb-2" style={{color: '#2c3e50'}}>{bookCount}</h3>
                  <p className="mb-0" style={{color: '#555'}}>Books in Library</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm h-100 hover-card ${isLoaded ? 'fade-in-up-delay-2' : ''}`} style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #c5e3f6 0%, #a7d5ed 100%)'
              }}>
                <div className="card-body p-4">
                  <div className="display-4 mb-3">⭐</div>
                  <h3 className="fw-bold mb-2" style={{color: '#2c3e50'}}>Rate & Review</h3>
                  <p className="mb-0" style={{color: '#555'}}>Share Your Thoughts</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm h-100 hover-card ${isLoaded ? 'fade-in-up-delay-3' : ''}`} style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)'
              }}>
                <div className="card-body p-4">
                  <div className="display-4 mb-3">📊</div>
                  <h3 className="fw-bold mb-2" style={{color: '#2c3e50'}}>Track Progress</h3>
                  <p className="mb-0" style={{color: '#555'}}>Monitor Your Journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className={`text-center mb-5 ${isLoaded ? 'fade-in-up-delay-4' : ''}`}>
            <h2 className="display-5 fw-bold mb-3" style={{color: '#2c3e50'}}>Why Choose Liberia?</h2>
            <p className="lead" style={{color: '#555'}}>
              Everything you need to manage your reading journey in one beautiful place
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className={`card border-0 shadow-lg h-100 hover-card ${isLoaded ? 'fade-in-up-delay-4' : ''}`} style={{
                borderRadius: '25px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{fontSize: '80px'}}>📚</div>
                </div>
                <div className="card-body p-4 text-center">
                  <h4 className="fw-bold mb-3" style={{color: '#2c3e50'}}>Organize</h4>
                  <p style={{color: '#666'}}>Keep all your books neatly organized with smart categorization</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className={`card border-0 shadow-lg h-100 hover-card ${isLoaded ? 'fade-in-up-delay-4' : ''}`} style={{
                borderRadius: '25px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{fontSize: '80px'}}>⭐</div>
                </div>
                <div className="card-body p-4 text-center">
                  <h4 className="fw-bold mb-3" style={{color: '#2c3e50'}}>Rate & Review</h4>
                  <p style={{color: '#666'}}>Share thoughts with ratings and detailed reviews</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className={`card border-0 shadow-lg h-100 hover-card ${isLoaded ? 'fade-in-up-delay-5' : ''}`} style={{
                borderRadius: '25px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{fontSize: '80px'}}>🎯</div>
                </div>
                <div className="card-body p-4 text-center">
                  <h4 className="fw-bold mb-3" style={{color: '#2c3e50'}}>Track Progress</h4>
                  <p style={{color: '#666'}}>Monitor reading status from wishlist to completed</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className={`card border-0 shadow-lg h-100 hover-card ${isLoaded ? 'fade-in-up-delay-5' : ''}`} style={{
                borderRadius: '25px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{fontSize: '80px'}}>🎨</div>
                </div>
                <div className="card-body p-4 text-center">
                  <h4 className="fw-bold mb-3" style={{color: '#2c3e50'}}>Beautiful UI</h4>
                  <p style={{color: '#666'}}>Stunning interface designed for book lovers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="position-relative" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '3rem 0',
        marginTop: '5rem'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8 text-center text-md-start">
              <h5 className="fw-bold mb-2">📚 Liberia</h5>
              <p className="mb-0" style={{color: '#e0e7ff'}}>
                Your personal digital library for tracking and organizing books
              </p>
            </div>
            <div className="col-md-4 text-center text-md-end mt-3 mt-md-0">
              <p className="mb-0" style={{color: '#cbd5e1'}}>
                © 2025 Liberia
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(45deg); opacity: 1; }
          50% { transform: scale(1.05) rotate(45deg); opacity: 0.8; }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }

        .fade-in-up { animation: fadeInUp 1s ease-out; }
        .fade-in-up-delay-1 { animation: fadeInUp 1s ease-out 0.2s both; }
        .fade-in-up-delay-2 { animation: fadeInUp 1s ease-out 0.4s both; }
        .fade-in-up-delay-3 { animation: fadeInUp 1s ease-out 0.6s both; }
        .fade-in-up-delay-4 { animation: fadeInUp 1s ease-out 0.8s both; }
        .fade-in-up-delay-5 { animation: fadeInUp 1s ease-out 1s both; }
        .float-animation { animation: float 3s ease-in-out infinite; }

        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .glow-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
        }

        .pulse-button {
          animation: pulse 2s infinite;
        }
        .pulse-button:hover {
          animation: none;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}