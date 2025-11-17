'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'want-to-read' as Book['status'],
    rating: 0,
    coverUrl: '',
    review: ''
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
          setFormData({
            title: bookData.title,
            author: bookData.author,
            genre: bookData.genre,
            status: bookData.status,
            rating: bookData.rating || 0,
            coverUrl: bookData.coverUrl || '',
            review: bookData.review || ''
          });
        } else {
          setBook(null);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (status: Book['status']) => {
    setFormData(prev => ({
      ...prev,
      status,
      rating: status !== 'completed' ? 0 : prev.rating
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/books/${id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update book');
        setSaving(false);
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/books');
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

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff 100%)'}}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff 100%)'}}>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-exclamation-triangle text-warning mb-4" viewBox="0 0 16 16">
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
          </svg>
          <h2 className="fw-bold mb-3">Book Not Found</h2>
          <p className="text-muted mb-4">The book you're trying to edit doesn't exist.</p>
          <Link href="/books" className="btn btn-primary btn-lg px-5 py-3" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '50px'
          }}>
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff 100%)'}}>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-exclamation-triangle text-warning mb-4" viewBox="0 0 16 16">
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
          </svg>
          <h2 className="fw-bold mb-3">Book Not Found</h2>
          <p className="text-muted mb-4">The book you're trying to edit doesn't exist.</p>
          <Link href="/books" className="btn btn-primary btn-lg px-5 py-3" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '50px'
          }}>
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff 100%)'}}>
      <div style={{position: 'fixed', top: '50px', left: '-150px', width: '400px', height: '400px', background: '#ffd6e8', borderRadius: '50%', opacity: 0.2, zIndex: 0}}></div>
      <div style={{position: 'fixed', bottom: '-100px', right: '-100px', width: '350px', height: '350px', background: '#c5e3f6', borderRadius: '50%', opacity: 0.2, zIndex: 0}}></div>
      
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
        </div>
      </nav>

      <div className="container py-5 position-relative" style={{zIndex: 1}}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Link href={`/books/${id}`} className="btn btn-lg px-4" style={{
                background: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '50px',
                fontWeight: '600'
              }}>
                ← Back to Book
              </Link>
              
              <h1 className="text-center mb-0 flex-grow-1 mx-3" style={{color: '#2c3e50'}}>
                Edit Book
              </h1>
              
              <div style={{width: '120px'}}></div> {/* Spacer for balance */}
            </div>

            <div className="card border-0 shadow-lg" style={{borderRadius: '30px'}}>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="text-center mb-5">
                    <div className="position-relative d-inline-block">
                      {formData.coverUrl ? (
                        <img 
                          src={formData.coverUrl} 
                          alt="Book cover" 
                          style={{
                            width: '200px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '20px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                          }}
                        />
                      ) : (
                        <div 
                          style={{
                            width: '200px',
                            height: '300px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white" className="bi bi-book" viewBox="0 0 16 16" style={{opacity: 0.7}}>
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <label htmlFor="title" className="form-label fw-bold" style={{color: '#2c3e50'}}>
                        📖 Book Title *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #e0e0e0',
                          padding: '12px 20px',
                          fontSize: '1.1rem'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="author" className="form-label fw-bold" style={{color: '#2c3e50'}}>
                        ✍️ Author *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #e0e0e0',
                          padding: '12px 20px',
                          fontSize: '1.1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <label htmlFor="genre" className="form-label fw-bold" style={{color: '#2c3e50'}}>
                        🏷️ Genre *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #e0e0e0',
                          padding: '12px 20px',
                          fontSize: '1.1rem'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="coverUrl" className="form-label fw-bold" style={{color: '#2c3e50'}}>
                        🖼️ Cover Image URL
                      </label>
                      <input
                        type="url"
                        className="form-control form-control-lg"
                        id="coverUrl"
                        name="coverUrl"
                        value={formData.coverUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/cover.jpg"
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #e0e0e0',
                          padding: '12px 20px',
                          fontSize: '1.1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="form-label fw-bold mb-3" style={{color: '#2c3e50'}}>
                      📚 Reading Status *
                    </label>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <button
                          type="button"
                          className={`btn w-100 py-3 ${formData.status === 'want-to-read' ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => handleStatusChange('want-to-read')}
                          style={{borderRadius: '15px', fontWeight: '600'}}
                        >
                          📚 Want to Read
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button
                          type="button"
                          className={`btn w-100 py-3 ${formData.status === 'reading' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => handleStatusChange('reading')}
                          style={{borderRadius: '15px', fontWeight: '600'}}
                        >
                          📖 Currently Reading
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button
                          type="button"
                          className={`btn w-100 py-3 ${formData.status === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleStatusChange('completed')}
                          style={{borderRadius: '15px', fontWeight: '600'}}
                        >
                          ✅ Completed
                        </button>
                      </div>
                    </div>
                  </div>

                  {formData.status === 'completed' && (
                    <div className="mb-5">
                      <label className="form-label fw-bold mb-3" style={{color: '#2c3e50'}}>
                        ⭐ Rating
                      </label>
                      <div className="text-center">
                        <div className="d-flex justify-content-center gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => handleRatingChange(star)}
                              style={{fontSize: '3rem'}}
                            >
                              {star <= formData.rating ? '⭐' : '☆'}
                            </button>
                          ))}
                        </div>
                        <p className="text-muted">
                          {formData.rating > 0 ? `Selected: ${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Click stars to rate'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mb-5">
                    <label htmlFor="review" className="form-label fw-bold" style={{color: '#2c3e50'}}>
                      📝 Review
                    </label>
                    <textarea
                      className="form-control"
                      id="review"
                      name="review"
                      value={formData.review}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Share your thoughts about this book..."
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e0e0e0',
                        padding: '15px 20px',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div className="row g-4">
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btn-danger w-100 py-3"
                        onClick={handleDelete}
                        style={{
                          borderRadius: '15px',
                          fontWeight: '600',
                          fontSize: '1.1rem'
                        }}
                      >
                        🗑️ Delete Book
                      </button>
                    </div>
                    <div className="col-md-8">
                      <div className="row g-3">
                        <div className="col-6">
                          <Link
                            href={`/books/${id}`}
                            className="btn btn-outline-secondary w-100 py-3"
                            style={{
                              borderRadius: '15px',
                              fontWeight: '600',
                              fontSize: '1.1rem'
                            }}
                          >
                            Cancel
                          </Link>
                        </div>
                        <div className="col-6">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 py-3"
                            disabled={saving}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              borderRadius: '15px',
                              fontWeight: '600',
                              fontSize: '1.1rem',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {saving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Saving...
                              </>
                            ) : (
                              '💾 Save Changes'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
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
    </div>
  );
}