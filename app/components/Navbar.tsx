"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { checkAndAddUser } from "../actions";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      checkAndAddUser(user?.primaryEmailAddress?.emailAddress);
    }
  }, [user]);

  return (
    <div className="bg-base-200/30 px-5 md:px-[10%] py-4 relative">
      {isLoaded &&
        (isSignedIn ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                  <Menu size={28} />
                </button>
                <div className="relative flex items-center text-2xl font-bold">
                  <span className="absolute top-0 left-0 text-4xl text-gray-300 -z-10">$</span>
                  Spend <span className="text-accent">.Wise</span>
                </div>
              </div>

              <div className="hidden space-x-4 md:flex">
                <Link href="/budjets" className="bg-gray-300 btn hover:bg-orange-400">
                  Mes budjets
                </Link>
                <Link href="/dashboard" className="bg-gray-300 btn hover:bg-orange-400">
                  Tableau de bord
                </Link>
                <Link href="/transactions" className="bg-gray-300 btn hover:bg-orange-400">
                  Mes Transactions
                </Link>
              </div>

              <UserButton />
            </div>

            {isMenuOpen && (
              <div className="flex flex-col mt-4 space-y-2 md:hidden">
                <Link href="/budjets" className="bg-gray-300 btn hover:bg-orange-400">
                  Mes budjets
                </Link>
                <Link href="/dashboard" className="bg-gray-300 btn hover:bg-orange-400">
                  Tableau de bord
                </Link>
                <Link href="/transactions" className="bg-gray-300 btn hover:bg-orange-400">
                  Mes Transactions
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                <Menu size={28} />
              </button>
              <div className="relative flex items-center text-2xl font-bold">
                <span className="absolute top-0 left-0 text-4xl text-gray-300 -z-10">$</span>
                Spend <span className="text-accent">.Wise</span>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <Link href="/sign-in" className="bg-gray-300 btn btn-sm hover:bg-orange-400">
                Se connecter
              </Link>
              <Link href="/sign-up" className="mx-4 bg-gray-300 btn btn-sm btn-accent hover:bg-orange-400">
                S&apos;inscrire
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
