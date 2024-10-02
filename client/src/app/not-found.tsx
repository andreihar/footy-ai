import { redirect } from 'next/navigation';

export default function NotFoundPage() {
  redirect('/en/not-found');
}
