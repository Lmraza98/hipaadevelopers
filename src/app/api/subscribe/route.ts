import { NextResponse } from 'next/server';
import { emailOctopus } from '@/lib/emailoctopus';
import { type ChecklistFormData } from '@/lib/schemas/checklist-form';

export async function POST(request: Request) {
  try {
    const body = await request.json() as ChecklistFormData;
    const { email, name } = body;

    const listId = process.env.NEXT_PUBLIC_EMAIL_OCTOPUS_LIST_ID;

    if (!listId) {
      console.error('EmailOctopus List ID is not configured.');
      return NextResponse.json({ error: 'Configuration error: Email list ID is missing.' }, { status: 500 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    await emailOctopus.addContactToList(listId, {
      email_address: email,
      fields: {
        FirstName: name || undefined,
      },
      tags: ['HIPAA-Checklist-Download'],
    });

    return NextResponse.json({ message: 'Successfully subscribed.' }, { status: 200 });

  } catch (error) {
    console.error('Subscription API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 