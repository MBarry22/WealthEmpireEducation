import Image from 'next/image';
import { Inter } from 'next/font/google';
import placeholder from '../pages/components/images/placeholder.png';
import Link from 'next/link';
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] });

export default function Home({ courses, blogs }) {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-center logo-text">Welcome to Wealth Empire</h1>
          <p className="text-2xl font-bold text-center logo-text">We are a community of investors and traders</p>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4">Courses</h2>
          <div className="grid grid-cols-3 gap-6">
            {courses.map((course) => (
              <div className="bg-gray-100 p-4 rounded-md cursor-pointer" key={course._id}>
                <Link href={`/courses/${encodeURIComponent(course.title)}`}>
                  <div className="h-35 w-full bg-black flex justify-center items-center">
                    <Image src={placeholder} alt="image" width={300} height={150} objectFit="cover" />
                  </div>
                </Link>
                <div className="mt-2 h-6 w-24 bg-gray-300">
                  <p className="text-sm font-bold text-center">{course.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4">Blogs</h2>
          <div className="grid grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div className="bg-gray-100 p-4 rounded-md cursor-pointer" key={blog._id}>
                <Link href={`/blog/${encodeURIComponent(blog.title)}`}>
                  <div className="h-35 w-full bg-black flex justify-center items-center">
                    <Image src={placeholder} alt="image" width={300} height={150} objectFit="cover" />
                  </div>
                </Link>
                <div className="mt-2 h-6 w-24 bg-gray-300">
                  <p className="text-sm font-bold text-center">{blog.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  try {
    const coursesRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/get-courses`);
    const blogsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`);
    const courses = coursesRes.data;
    const blogs = blogsRes.data;

    return {
      props: {
        courses,
        blogs,
      },
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      props: {
        courses: [],
        blogs: [],
      },
    };
  }
}
