"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SessionLinks() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setHasToken(!!t);
  }, []);

  function logout() {
    try {
      localStorage.removeItem('token');
    } catch (e) {}
    router.push("/");
  }

  return (
    <div className="flex items-center space-x-4">
      {hasToken ? (
        <>
          <Link href="/mi_cuenta" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500">
            <i data-feather="user" />
          </Link>
          <button onClick={logout} className="text-gray-600 hover:text-red-500">
            Cerrar sesión
          </button>
        </>
      ) : (
        <Link href="/login" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500">
          <i data-feather="user" />
        </Link>
      )}
    </div>
  );
}
