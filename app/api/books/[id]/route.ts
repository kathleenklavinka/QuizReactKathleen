import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }
    });
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id }
    });
    
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' }, 
        { status: 404 }
      );
    }

    if (!body.title || !body.author || !body.genre) {
      return NextResponse.json(
        { error: 'Title, author, and genre are required' },
        { status: 400 }
      );
    }

    const validStatus = ['reading', 'completed', 'want-to-read'];
    if (!validStatus.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    let rating = body.rating;
    if (body.status === 'completed') {
      if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating between 1-5 is required for completed books' },
          { status: 400 }
        );
      }
    } else {
      rating = 0;
    }

    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: body.title,
        author: body.author,
        genre: body.genre,
        status: body.status,
        rating: rating,
        coverUrl: body.coverUrl || null,
        review: body.review || null,
      }
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id }
    });
    
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' }, 
        { status: 404 }
      );
    }

    await prisma.book.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Book deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' }, 
      { status: 500 }
    );
  }
}