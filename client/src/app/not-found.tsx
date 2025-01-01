import { redirect } from 'next/navigation';
import { years } from '@/config';

export default function NotFoundPage() {
  redirect(`/en/${years[0]}/not-found`);
}
