import { supabase } from '@/lib/utils/env';
import { prisma } from '@/lib/utils/prisma';
import { NextRequest } from 'next/server';

export async function requireUserId(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const appUser = await prisma.user.findUnique({
    where: { supabaseUserId: data.user.id },
    select: { id: true },
  });
  if (!appUser) return null;

  return appUser.id;
}
