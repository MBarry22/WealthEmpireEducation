import Image from 'next/image';
import { Inter } from 'next/font/google';
import placeholder from '../components/images/placeholder.png';
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] });

export default function Blog({ blog }) {
  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-center logo-text">Individual Page</h1>
        </div>

        <div className="mt-8 w-full h-96 relative">
          <div className="absolute w-full h-full bg-black opacity-70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Image src={placeholder} alt="image" width={600} height={400} objectFit="contain" />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">{blog.title}</h2>
          <p className="text-gray-500">{blog.description}</p>
          <p className="mt-4 text-lg">{blog.content}</p>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${params.title}`);
    const blog = res.data;

    return {
      props: {
        blog,
      },
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      notFound: true, // Return 404 page if blog not found
    };
  }
}
