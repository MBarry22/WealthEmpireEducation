import '@/styles/globals.css'
import '@/styles/home.css'
import Nav from '@/pages/components/nav'

export default function App({ Component, pageProps }) {
  return <>
  <Nav />
  <Component {...pageProps} />
</>
}
