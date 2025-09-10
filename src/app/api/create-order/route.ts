import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Only initialize Razorpay if environment variables are available
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-rtb-fingerprint-id',
};

export async function POST(request: Request) {
  try {
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { 
          status: 503,
          headers: corsHeaders
        }
      );
    }

    const { amount, currency = 'INR' } = await request.json();

    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(
      { id: order.id, amount: order.amount },
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { 
      status: 200,
      headers: corsHeaders
    }
  );
} 