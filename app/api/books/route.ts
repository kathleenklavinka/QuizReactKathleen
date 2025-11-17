import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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

    if (body.status === 'completed' && (!body.rating || body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating between 1-5 is required for completed books' },
        { status: 400 }
      );
    }

    const rating = body.status === 'completed' ? body.rating : 0;

    const book = await prisma.book.create({
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

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' }, 
      { status: 500 }
    );
  }
}