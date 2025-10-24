import { Chat } from '@/components/chat';

export default async function Page() {
  const id = 'main-chat';

  return (
    <>
      <Chat key={id} id={id} initialMessages={[]} isReadonly={false} />
    </>
  );
}
