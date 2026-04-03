import { prisma } from '@/lib/utils/prisma';
// DB接続確認
export async function GET() {
  try {
    await prisma.user.count();
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false });
  }
}
