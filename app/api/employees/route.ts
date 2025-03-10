/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'role'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: data.email });
    if (existingEmployee) {
      return NextResponse.json(
        { message: 'An employee with this email already exists' },
        { status: 400 }
      );
    }

    const employee = await Employee.create({
      ...data,
      createdBy: session.user.id
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { 
        message: 'Something went wrong',
      }, 
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const employees = await Employee.find({ createdBy: session.user.id })
      .sort({ createdAt: -1 });
    
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 