import { Metadata } from 'next';
import BlogClient from './components/BlogClient';

export const metadata: Metadata = {
  title: 'Blog - Revv Tuned',
  description: 'Chiptuning, otomotiv ve performans hakkında güncel yazılar, haberler ve ipuçları.',
};

export default function BlogPage() {
  return <BlogClient />;
} 