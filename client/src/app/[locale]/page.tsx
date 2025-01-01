import { redirect } from 'next/navigation';
import { years } from '@/config';

export default function RootPage() {
  redirect(`/en/${years[0]}`);
}
