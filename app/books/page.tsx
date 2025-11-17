'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  .fade-in-up { animation: fadeInUp 0.6s ease-out; }
  .scale-in { animation: scaleIn 0.6s ease-out; }
  
  .hover-lift {
    transition: all 0.3s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  }
`;

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  status: 'reading' | 'completed' | 'want-to-read';
  coverUrl?: string;
  review?: string;
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    rating: 0,
    status: 'want-to-read' as Book['status'],
    coverUrl: '',
    review: ''
  });

  // Fetch books dari API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author || !formData.genre) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.status === 'completed' && formData.rating === 0) {
      alert('Please rate the book since you have completed it!');
      return;
    }
    
    const newBook = {
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      rating: formData.status === 'completed' ? formData.rating : 0,
      status: formData.status,
      coverUrl: formData.coverUrl,
      review: formData.review
    };

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const createdBook = await response.json();
        setBooks([createdBook, ...books]);
        setFormData({
          title: '',
          author: '',
          genre: '',
          rating: 0,
          status: 'want-to-read',
          coverUrl: '',
          review: ''
        });
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create book');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      alert('Failed to create book');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setBooks(books.filter(book => book.id !== id));
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete book');
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/books/${id}`);
  };

  const getStatusBadge = (status: Book['status']) => {
    const badges = {
      'reading': 'bg-info',
      'completed': 'bg-success',
      'want-to-read': 'bg-warning'
    };
    return badges[status];
  };

  const getStatusText = (status: Book['status']) => {
    const text = {
      'reading': 'Reading',
      'completed': 'Completed',
      'want-to-read': 'Want to Read'
    };
    return text[status];
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff 100%)'}}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff 100%)'}}>
      <style>{styles}</style>
      
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

      <div className="container py-5">
        <div style={{position: 'fixed', top: '100px', left: '-100px', width: '300px', height: '300px', background: '#ffd6e8', borderRadius: '50%', opacity: 0.3, zIndex: 0}}></div>
        <div style={{position: 'fixed', top: '400px', right: '-100px', width: '250px', height: '250px', background: '#c5e3f6', borderRadius: '50%', opacity: 0.3, zIndex: 0}}></div>
        <div style={{position: 'fixed', bottom: '100px', left: '50%', width: '200px', height: '200px', background: '#fff3cd', borderRadius: '50%', opacity: 0.3, zIndex: 0}}></div>

        <div className="position-relative" style={{zIndex: 1}}>
          <div className={`text-center mb-5 fade-in-up`}>
            <h1 className="display-4 fw-bold mb-3" style={{color: '#2c3e50'}}>My Book Collection</h1>
            <p className="lead mb-4" style={{color: '#555'}}>
              {books.length === 0 ? 'Start building your library' : `${books.length} ${books.length === 1 ? 'book' : 'books'} in your library`}
            </p>
            {!showForm && (
              <button 
                className="btn btn-lg px-5 py-3 scale-in"
                onClick={() => setShowForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
                }}
              >
                + Add New Book
              </button>
            )}
          </div>

          {showForm && (
            <div className="row justify-content-center mb-5 scale-in">
              <div className="col-lg-8">
                <div className="card shadow-lg border-0" style={{borderRadius: '20px'}}>
                  <div className="card-body p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="fw-bold mb-0 text-center flex-grow-1">Add New Book</h3>
                      <button 
                        onClick={() => setShowForm(false)}
                        className="btn btn-sm"
                        style={{
                          background: '#f8f9fa',
                          border: 'none',
                          borderRadius: '10px',
                          width: '40px',
                          height: '40px',
                          fontSize: '1.5rem',
                          color: '#6c757d'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Book Title *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          style={{borderRadius: '10px'}}
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Enter book title"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Author Name *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          style={{borderRadius: '10px'}}
                          value={formData.author}
                          onChange={(e) => setFormData({...formData, author: e.target.value})}
                          placeholder="Enter author name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Genre *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          style={{borderRadius: '10px'}}
                          value={formData.genre}
                          onChange={(e) => setFormData({...formData, genre: e.target.value})}
                          placeholder="e.g., Fiction, Mystery"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Reading Status *</label>
                        <select
                          className="form-select form-select-lg"
                          style={{borderRadius: '10px'}}
                          value={formData.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Book['status'];
                            setFormData({
                              ...formData, 
                              status: newStatus,
                              rating: newStatus === 'completed' ? formData.rating : 0
                            });
                          }}
                        >
                          <option value="want-to-read">📚 Want to Read</option>
                          <option value="reading">📖 Currently Reading</option>
                          <option value="completed">✅ Completed</option>
                        </select>
                      </div>
                      
                      {formData.status === 'completed' && (
                        <div className="col-12">
                          <label className="form-label fw-bold">Your Rating * (Only for completed books)</label>
                          <select
                            className="form-select form-select-lg"
                            style={{borderRadius: '10px'}}
                            value={formData.rating}
                            onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                          >
                            <option value={0}>Select rating...</option>
                            {[5,4,3,2,1].map(num => (
                              <option key={num} value={num}>{'⭐'.repeat(num)} ({num}/5)</option>
                            ))}
                          </select>
                          <small className="text-muted">⭐ You can only rate books you've completed</small>
                        </div>
                      )}

                      {formData.status !== 'completed' && (
                        <div className="col-12">
                          <div className="alert alert-info" style={{borderRadius: '15px'}}>
                            <strong>ℹ️ Note:</strong> You can only rate books after marking them as "Completed"
                          </div>
                        </div>
                      )}

                      <div className="col-12">
                        <label className="form-label fw-bold">Cover Image URL (Optional)</label>
                        <input
                          type="url"
                          className="form-control form-control-lg"
                          style={{borderRadius: '10px'}}
                          value={formData.coverUrl}
                          onChange={(e) => setFormData({...formData, coverUrl: e.target.value})}
                          placeholder="https://example.com/book-cover.jpg"
                        />
                        <small className="text-muted">Paste a link to the book cover image</small>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold">Your Review (Optional)</label>
                        <textarea
                          className="form-control form-control-lg"
                          style={{borderRadius: '10px'}}
                          rows={4}
                          value={formData.review}
                          onChange={(e) => setFormData({...formData, review: e.target.value})}
                          placeholder="Share your thoughts about this book..."
                        />
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <button onClick={handleSubmit} className="btn btn-lg px-5 py-3" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '50px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        Add to Library
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {books.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" className="bi bi-book text-muted" viewBox="0 0 16 16" style={{opacity: 0.3}}>
                  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                </svg>
              </div>
              <h3 className="fw-bold text-muted mb-3">Your Library is Empty</h3>
              <p className="text-muted mb-4">Start your reading journey by adding your first book!</p>
            </div>
          ) : (
            <>
              <h2 className="fw-bold mb-4" style={{color: '#2c3e50'}}>Books Showcase</h2>
              <div className="row g-4">
                {books.map((book) => (
                  <div key={book.id} className="col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 border-0 shadow hover-lift" style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewDetails(book.id)}
                    >
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          className="card-img-top" 
                          alt={book.title}
                          style={{height: '350px', objectFit: 'cover'}}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            height: '350px',
                            background: `linear-gradient(135deg, ${
                              book.status === 'reading' ? '#667eea, #764ba2' :
                              book.status === 'completed' ? '#11998e, #38ef7d' :
                              '#f093fb, #f5576c'
                            })`
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white" className="bi bi-book" viewBox="0 0 16 16" style={{opacity: 0.5}}>
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                          </svg>
                        </div>
                      )}
                      
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className={`badge ${getStatusBadge(book.status)} text-white`}>
                            {getStatusText(book.status)}
                          </span>
                          {book.status === 'completed' && book.rating > 0 && (
                            <div className="text-warning" style={{fontSize: '0.85rem'}}>
                              {'⭐'.repeat(book.rating)}
                            </div>
                          )}
                        </div>
                        
                        <h5 className="card-title fw-bold mb-2" style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '3rem'
                        }}>
                          {book.title}
                        </h5>
                        
                        <p className="text-muted small mb-2">by {book.author}</p>
                        <span className="badge bg-light text-dark">{book.genre}</span>
                        
                        {book.review && (
                          <p className="card-text text-muted small mt-3 mb-0" style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            "{book.review}"
                          </p>
                        )}
                      </div>
                      
                      <div className="card-footer bg-white border-0 p-3">
                        <div className="d-flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(book.id);
                            }}
                            className="btn btn-sm btn-outline-primary flex-grow-1"
                            style={{borderRadius: '10px'}}
                          >
                            View Details
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(book.id);
                            }}
                            className="btn btn-sm btn-outline-danger"
                            style={{borderRadius: '10px'}}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
    </div>
  );
}