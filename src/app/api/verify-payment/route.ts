import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
  }

  try {
    // Here you would typically:
    // 1. Check your database for the payment status
    // 2. Verify with your payment provider's API
    // 3. Return the actual payment status

    // For now, we'll simulate a successful payment after 30 seconds
    const paymentTime = parseInt(paymentId.split('_')[1]);
    const currentTime = Date.now();
    const timeElapsed = currentTime - paymentTime;

    if (timeElapsed > 30000) { // 30 seconds
      return NextResponse.json({ status: 'success' });
    } else {
      return NextResponse.json({ status: 'pending' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ status: 'failed' }, { status: 500 });
  }
} 