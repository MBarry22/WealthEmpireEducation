import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Image from 'next/image';
import Link from 'next/link';
import wealthEmpire from '../components/images/wealthEmpire.png';

export default function Nav() {

  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center w-1/2 px-4 py-4">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image src={wealthEmpire} alt="logo" width={40} height={40} />
            <h1 className="text-xl font-bold px-4 logo-text">WEALTH EMPIRE EDUCATION</h1>
          </div>
        </Link>
      </div>
      
    </nav>
  );
}