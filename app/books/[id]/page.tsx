'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`);
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
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
  }, [params.id]);

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
      'reading': '📖 Currently Reading',
      'completed': '✅ Finished Reading',
      'want-to-read': '📚 Want to Read'
    };
    return text[status];
  };

  const handleEdit = () => {
    router.push(`/books/edit/${params.id}`);
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
          <p className="text-muted mb-4">The book you're looking for doesn't exist in your library.</p>
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link href="/books" className="btn btn-lg px-4" style={{
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '50px',
            fontWeight: '600'
          }}>
            ← Back to Library
          </Link>
          
          <button 
            onClick={handleEdit}
            className="btn btn-lg px-4"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✏️ Edit Book
          </button>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <div className="sticky-top" style={{top: '100px'}}>
              <div className="card border-0 shadow-lg" style={{borderRadius: '30px', overflow: 'hidden'}}>
                {book.coverUrl ? (
                  <img 
                    src={book.coverUrl} 
                    className="card-img-top" 
                    alt={book.title}
                    style={{height: '600px', objectFit: 'cover'}}
                  />
                ) : (
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      height: '600px',
                      background: `linear-gradient(135deg, ${
                        book.status === 'reading' ? '#667eea, #764ba2' :
                        book.status === 'completed' ? '#11998e, #38ef7d' :
                        '#f093fb, #f5576c'
                      })`
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="white" className="bi bi-book" viewBox="0 0 16 16" style={{opacity: 0.4}}>
                      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-lg mb-4" style={{borderRadius: '30px'}}>
              <div className="card-body p-5">
                <div className="mb-4">
                  <span className={`badge ${getStatusBadge(book.status)} fs-5 px-4 py-3`} style={{borderRadius: '15px'}}>
                    {getStatusText(book.status)}
                  </span>
                </div>

                <h1 className="display-4 fw-bold mb-3" style={{color: '#2c3e50'}}>
                  {book.title}
                </h1>
                
                <h4 className="text-muted mb-4">by {book.author}</h4>
                
                {book.status === 'completed' && book.rating > 0 && (
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="fs-2">
                        {'⭐'.repeat(book.rating)}
                      </div>
                      <span className="fs-4 fw-bold" style={{color: '#2c3e50'}}>
                        {book.rating}.0 / 5.0
                      </span>
                    </div>
                  </div>
                )}

                {book.status !== 'completed' && (
                  <div className="mb-4">
                    <div className="alert alert-info" style={{borderRadius: '15px'}}>
                      <strong>ℹ️ Not Rated Yet</strong><br/>
                      <small>You can only rate books after marking them as "Completed"</small>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <span className="badge bg-light text-dark fs-5 px-4 py-2" style={{borderRadius: '15px'}}>
                    {book.genre}
                  </span>
                </div>

                <hr className="my-5" />

                <div className="row g-4 mb-5">
                  <div className="col-6">
                    <div className="p-4 h-100" style={{
                      background: 'linear-gradient(135deg, #ffd6e8 0%, #ffc4d6 100%)',
                      borderRadius: '20px'
                    }}>
                      <div className="text-muted mb-2 fw-bold small">RATING</div>
                      <div className="fs-3 fw-bold">
                        {book.status === 'completed' && book.rating > 0 ? `${book.rating}/5 ⭐` : 'Not Rated'}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-4 h-100" style={{
                      background: 'linear-gradient(135deg, #c5e3f6 0%, #a7d5ed 100%)',
                      borderRadius: '20px'
                    }}>
                      <div className="text-muted mb-2 fw-bold small">GENRE</div>
                      <div className="fs-3 fw-bold">{book.genre}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-4 h-100" style={{
                      background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
                      borderRadius: '20px'
                    }}>
                      <div className="text-muted mb-2 fw-bold small">AUTHOR</div>
                      <div className="fs-5 fw-bold">{book.author}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-4 h-100" style={{
                      background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
                      borderRadius: '20px'
                    }}>
                      <div className="text-muted mb-2 fw-bold small">STATUS</div>
                      <div className="fs-6 fw-bold">
                        {book.status === 'reading' ? '📖 Reading' : 
                         book.status === 'completed' ? '✅ Done' : 
                         '📚 To Read'}
                      </div>
                    </div>
                  </div>
                </div>

                {book.review && (
                  <>
                    <h3 className="fw-bold mb-3" style={{color: '#2c3e50'}}>
                      📝 My Review
                    </h3>
                    <div className="p-4 mb-4" style={{
                      background: '#f8f9fa',
                      borderRadius: '20px',
                      borderLeft: '5px solid #667eea'
                    }}>
                      <p className="mb-0 fs-5" style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.8',
                        color: '#495057'
                      }}>
                        "{book.review}"
                      </p>
                    </div>
                  </>
                )}

                {!book.review && (
                  <div className="text-center py-4">
                    <p className="text-muted fst-italic">No review added yet</p>
                  </div>
                )}
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