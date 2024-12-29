"use client";

import { SignedIn, SignedOut, useUser,SignInButton,UserButton } from "@clerk/nextjs";

function Header() {
  const { user } = useUser();

  return (
    <div>
      {user && (
        <h1>
          {user?.firstName}
          {"'s"} Space
        </h1>
      )}

      {/* Breadcrumbs */}

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Header;
