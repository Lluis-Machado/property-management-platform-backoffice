import { Metadata } from 'next';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Local imports
import './globals.css'
import { barlow } from '@/lib/utils/mainFont'

export const metadata: Metadata = {
  title: 'WuF - Portal',
  description: 'Wohn- und Ferienimmobilien Eigentümer Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${barlow.variable}`}>
      <body> {children} </body>
    </html>
  )
}