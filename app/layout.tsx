// Libraries imports
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Metadata } from 'next';

// Local imports
import './globals.css';
import { barlow } from '@/lib/utils/mainFont';

export const metadata: Metadata = {
  description: 'WuF Backoffice Platform',
  title: 'WuF - Backoffice',
};

interface Props {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props): React.ReactElement => (
  <html className={`${barlow.variable}`}>
    <body> {children} </body>
  </html>
);

export default RootLayout;