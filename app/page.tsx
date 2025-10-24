import { redirect } from 'next/navigation';

export default async function Page() {
  // Redirect to /chat instead of generating a random ID
  redirect('/chat');
}
