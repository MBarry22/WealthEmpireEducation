import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/create-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, thumbnail, content })
    });

    if (response.ok) {
      const { id } = await response.json();
      router.push(`/individual`);
    } else {
      console.error('Failed to create blog post');
    }
  };

  return (
    <>
      <Head>
        <title>Create New Blog Post</title>
      </Head>
      <main className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Create New Blog Post</h1>
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700 font-bold ">Title</span>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black" required />
          </label>
          <label className="block">
            <span className="text-gray-700 font-bold">Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black" required></textarea>
          </label>
          <label className="block">
            <span className="text-gray-700 font-bold">Thumbnail</span>
            <input type="text" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black" required />
          </label>
          <label className="block">
            <span className="text-gray-700 font-bold">Content</span>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={8} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black" required></textarea>
          </label>
          <button type="submit" className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-black">Submit</button>
        </form>
      </main>
    </>
  );
}
