// Libraries imports
// import 'devextreme/dist/css/dx.light.css';
import '@/lib/assets/dx.generic.pg-theme.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.css';
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
}

const RootLayout = ({ children }: Props): React.ReactElement => (
    <html className={`${barlow.variable}`}>
        <body> {children} </body>
    </html>
);

export default RootLayout;
