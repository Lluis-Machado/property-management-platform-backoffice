// Libraries imports
import { faInstagram, faLinkedinIn, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Local imports
import Logo from '@/public/WuF_Symbol_Complete.png';

const currentYear = new Date().getFullYear();

const SocialMedia = [
    {
        name: 'LinkedIn',
        icon: faLinkedinIn,
        link: 'https://www.linkedin.com/company/willipedia/',
    },
    {
        name: 'Youtube',
        icon: faYoutube,
        link: 'https://www.youtube.com/c/Willipedia/featured',
    },
    {
        name: 'Twitter',
        icon: faTwitter,
        link: 'https://twitter.com/WillipediaTax',
    },
    {
        name: 'Instagram',
        icon: faInstagram,
        link: 'https://www.instagram.com/plattesgroup/',
    },
];

const PlattesGroupLinks = [
    {
        name: 'Impressum',
        link: 'https://wuf.plattes.net/impressum',
    },
    {
        name: 'Datenschutz',
        link: 'https://wuf.plattes.net/datenschutz',
    },
];

export const Footer = () => {
    return (
        <div className='lg:px-10 lg:py-3'>
            <div className='flex flex-col justify-between items-center lg:flex-row'>
                {/* WuF Logo */}
                <div className='flex flex-row items-center p-4 w-auto order-1'>
                    <div className='w-sidebar-icon'>
                        <Image src={Logo} alt='WuF logo' priority />
                    </div>
                    <p className='text-center pl-4 text-2xl whitespace-nowrap select-none'>
                        Eigentümerportal
                    </p>
                </div>
                {/* Social media */}
                <div className='flex flex-row justify-between text-secondary-500 order-2 lg:order-3 py-4 lg:py-0'>
                    {SocialMedia.map(({ name, link, icon }) => (
                        <motion.a
                            key={name}
                            href={link}
                            target='_blank'
                            className='px-4 text-4xl flex items-center'
                            rel='noreferrer'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1 }}
                            transition={{ ease: "linear", duration: 0.1 }}
                        >
                            <FontAwesomeIcon icon={icon} />
                        </motion.a>
                    ))}
                </div>
                {/* PlattesGroup Links */}
                <div className='flex flex-col justify-evenly py-4 lg:py-0 order-3 lg:order-2'>
                    <div className='flex flex-row justify-between pb-3'>
                        {
                            PlattesGroupLinks.map((elem: any) => (
                                <a
                                    href={elem.link}
                                    target='_blank'
                                    className='text-links'
                                    rel='noreferrer'
                                    key={elem.name}
                                >
                                    {elem.name}
                                </a>
                            ))
                        }

                        Kontakt
                    </div>
                    <hr />
                    <p className='text-secondary-500 self-center pt-3 text-center'>
                        <>
                            © {currentYear}
                            <a
                                href='https://www.plattes.net/'
                                target='_blank'
                                className='text-links'
                                rel='noreferrer'
                            >
                                {' PlattesGroup'}
                            </a>
                            . Alle Rechte vorbehalten.
                        </>
                    </p>
                </div>
            </div>
        </div>
    )
}
