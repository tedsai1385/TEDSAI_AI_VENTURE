'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TEDChatbot from './TEDChatbot';

export default function TEDChatbotProvider() {
  const pathname = usePathname();

  // Masquer le chatbot sur certaines pages sensibles (login, admin, etc.)
  const hideOnPaths = ['/login', '/admin'];

  if (pathname && hideOnPaths.some(path => pathname.startsWith(path))) {
    return null;
  }

  return <TEDChatbot />;
}