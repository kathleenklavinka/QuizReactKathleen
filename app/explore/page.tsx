'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ExternalBook {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  key: string;
  subject?: string[];
}

export default function ExplorePage() {
  const [books, setBooks] = useState<ExternalBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('fantasy');
  const [searchInput, setSearchInput] = useState('fantasy');
  const [addingBook, setAddingBook] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (query = 'fantasy') => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
      );
      const data = await response.json();
      setBooks(data.docs || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    fetchBooks(searchInput);
  };

  const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M') => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  };

  const addToLibrary = async (book: ExternalBook) => {
    setAddingBook(book.key);
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author_name?.[0] || 'Unknown Author',
          genre: book.subject?.[0] || 'General',
          rating: 0,
          status: 'want-to-read',
          coverUrl: book.cover_i ? getCoverUrl(book.cover_i) : null,
          review: ''
        }),
      });

      if (response.ok) {
        alert(`"${book.title}" added to your library!`);
      } else {
        throw new Error('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book to library');
    } finally {
      setAddingBook(null);
    }
  };

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(180deg, #fef5e7 0%, #fff 100%)'}}>
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
            <Link href="/books" className="btn btn-outline-primary px-4" style={{borderRadius: '25px', fontWeight: '600'}}>
            My Library
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-5 position-relative" style={{zIndex: 1}}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header Section */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold mb-4" style={{color: '#2c3e50'}}>
                🌍 Explore Books
              </h1>
              <p className="lead text-muted mb-4">
                Discover millions of books from the Open Library database
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="row g-3 justify-content-center">
                <div className="col-lg-8 col-xl-6">
                  <div className="input-group input-group-lg shadow-sm">
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Search for books, authors, subjects..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      style={{
                        borderRadius: '50px 0 0 50px',
                        padding: '15px 25px',
                        fontSize: '1.1rem'
                      }}
                    />
                    <button
                      className="btn border-0 px-4"
                      type="submit"
                      style={{
                        borderRadius: '0 50px 50px 0',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: '600'
                      }}
                    >
                      🔍 Search
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Searching the library...</p>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{borderRadius: '20px', background: 'rgba(255,255,255,0.8)'}}>
                      <div className="card-body py-3">
                        <p className="mb-0 text-center">
                          📚 Found <strong>{books.length}</strong> books for "<strong>{searchTerm}</strong>"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Books Grid */}
                <div className="row g-4">
                  {books.map((book) => (
                    <div key={book.key} className="col-md-6 col-lg-4 col-xl-3">
                      <div 
                        className="card h-100 border-0 shadow-sm position-relative"
                        style={{ 
                          borderRadius: '20px', 
                          transition: 'all 0.3s ease',
                          overflow: 'hidden',
                          background: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                        }}
                      >
                        {/* Book Cover */}
                        <div className="position-relative" style={{height: '200px', overflow: 'hidden'}}>
                          {book.cover_i ? (
                            <img
                              src={getCoverUrl(book.cover_i, 'M')}
                              alt={book.title}
                              className="w-100 h-100"
                              style={{objectFit: 'cover'}}
                            />
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center w-100 h-100"
                              style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              }}
                            >
                              <span className="text-white fs-1">📖</span>
                            </div>
                          )}
                        </div>

                        {/* Book Info */}
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-2" style={{color: '#2c3e50', lineHeight: '1.4', height: '2.8em', overflow: 'hidden'}}>
                            {book.title}
                          </h6>
                          
                          <p className="text-muted small mb-2" style={{lineHeight: '1.3'}}>
                            by <strong>{book.author_name?.[0] || 'Unknown Author'}</strong>
                          </p>

                          {book.first_publish_year && (
                            <p className="text-muted small mb-2">
                              📅 {book.first_publish_year}
                            </p>
                          )}

                          {book.subject && (
                            <div className="mb-3">
                              <span className="badge bg-light text-dark px-3 py-2" style={{borderRadius: '15px', fontSize: '0.7rem'}}>
                                {book.subject[0] || 'General'}
                              </span>
                            </div>
                          )}
                          
                          {/* Add Button */}
                          <button
                            onClick={() => addToLibrary(book)}
                            disabled={addingBook === book.key}
                            className="btn w-100 mt-auto"
                            style={{
                              background: addingBook === book.key ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              borderRadius: '15px',
                              color: 'white',
                              fontWeight: '600',
                              padding: '10px 20px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (addingBook !== book.key) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (addingBook !== book.key) {
                                e.currentTarget.style.transform = 'translateY(0)';
                              }
                            }}
                          >
                            {addingBook === book.key ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Adding...
                              </>
                            ) : (
                              '➕ Add to Library'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {books.length === 0 && !loading && (
                  <div className="text-center py-5">
                    <div className="card border-0 shadow-sm" style={{borderRadius: '30px', background: 'rgba(255,255,255,0.9)'}}>
                      <div className="card-body py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-search text-muted mb-3" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                        <h4 className="fw-bold mb-3" style={{color: '#2c3e50'}}>No books found</h4>
                        <p className="text-muted mb-4">Try searching for different keywords or topics</p>
                        <button 
                          onClick={() => {
                            setSearchInput('fiction');
                            setSearchTerm('fiction');
                            fetchBooks('fiction');
                          }}
                          className="btn px-4"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '25px',
                            color: 'white',
                            fontWeight: '600'
                          }}
                        >
                          Try "Fiction"
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
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
                Data by <a href="https://openlibrary.org" className="text-white">Open Library</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}