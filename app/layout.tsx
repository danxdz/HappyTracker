import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DrawTogether - Collaborative Drawing Made Viral',
  description: 'Draw, collaborate, and create together in real-time. Share your art with the world!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  )
}