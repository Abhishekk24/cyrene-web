'use client'
import Image from 'next/image';
import Link from 'next/link';
import { FaXTwitter } from "react-icons/fa6";
import { TbBrandDiscord } from "react-icons/tb";
import { LiaTelegramPlane } from "react-icons/lia";

const Footer = () => {
  return (
    <footer className='relative bg-gradient-to-r from-gray-900 via-gray-800 to-black'>
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
       
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className='relative container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:pl-36 mb-24'>
          {/* Brand Section */}
          <div className=' text-center sm:text-left py-6'>
           
            <p className='text-gray-100 text-[14px] leading-relaxed py-4'>
              Powering the future of AI interaction through multi-agent collaboration with self-replicating, decentralized agents.
            </p>
            <div className='flex justify-center sm:justify-start space-x-4'>
              <Link href='https://x.com/CyreneAI' target='_blank' className='p-3 rounded-xl hover:bg-white/10 transition-colors'>
                <FaXTwitter className='w-7 h-7 text-gray-100 hover:text-white' />
              </Link>
              <Link href='https://discord.gg/qJ98QZ6EBx' target='_blank' className='p-3 rounded-xl hover:bg-white/10 transition-colors'>
                <TbBrandDiscord className='w-7 h-7 text-gray-100 hover:text-white' />
              </Link>
              <Link href='https://t.me/CyreneAI' target='_blank' className='p-3 rounded-xl hover:bg-white/10 transition-colors'>
                <LiaTelegramPlane className='w-7 h-7 text-gray-100 hover:text-white' />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className='lg:pl-12 lg:py-12 md:py-8'>
            <h3 className='text-white text-lg font-bold text-center sm:text-left lg:mb-4 md:mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-center sm:text-left'>
              {/* <li><Link href='/about' className='text-gray-100 hover:text-white transition-colors'>About</Link></li> */}
              <li><Link href='https://docs.netsepio.com/latest/cyreneai' className='text-gray-100 hover:text-white transition-colors'>Docs</Link></li>
              {/* <li><Link href='/token' className='text-gray-100 hover:text-white transition-colors'>Token</Link></li> */}
            </ul>
          </div>

          {/* Resources */}
          <div className='lg:pl-8 lg:py-12'>
            <h3 className='text-white text-lg font-bold text-center sm:text-left lg:mb-4 md:mb-4'>Resources</h3>
            <ul className='space-y-2 text-center sm:text-left'>
              <li><Link href='https://play.google.com/store/apps/details?id=com.erebrus.app' className='text-gray-100 hover:text-white transition-colors'>Erebrus Android</Link></li>
              <li><Link href='https://testflight.apple.com/join/BvdARC75' className='text-gray-100 hover:text-white transition-colors'>Erebrus iOS*</Link></li>
              <li><Link href='' className='text-gray-100 hover:text-white transition-colors'>Browser Extension</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className='lg:-ml-20 lg:py-12'>
            <h3 className='text-white text-lg font-bold text-center sm:text-left mb-4'>Contact</h3>
            <ul className='space-y-2 text-center sm:text-left'>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='lg:w-[1200px] md:w-[750px] mx-auto h-[1px] bg-white rounded-full mb-4'></div>
        <div className='flex flex-col sm:flex-row justify-between items-center text-white text-sm mt-4 space-y-4 sm:space-y-0 lg:pl-36'>
          
         
          <div className='flex space-x-6 lg:pr-36'>
            <Link href='/privacy' className='hover:text-white transition-colors'>Privacy Policy</Link>
            <Link href='/terms' className='hover:text-white transition-colors'>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;