

import { AlignJustify } from "lucide-react";
import { NavbarLinks } from "./NavbarLinks";
import { redis } from "@/app/lib/redis";
import { Cart } from "@/app/lib/interfaces";
import Logo from "./Logo";
import Wrapper from "./Wrapper";
import HeaderIcons from "./HeaderIcons";
import Search from "./Search";
import Topbar from "./Topbar";
import { cookies } from "next/headers";
import getSession from "@/lib/getSession";
import { auth } from "@/auth";

export async function Navbar() {
  const session = await auth()
  const user = session?.user;

  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;

  const cart: Cart | null = await redis.get(`cart-${cartId}`);

  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="bg-white ">
      <header >
        <Topbar />
        <Wrapper>
          <div className="grid grid-cols-2 lg:grid-cols-12 items-center">
            <div className="col-span-1 lg:col-span-3">
              <div className="flex items-center">
                <div className="lg:hidden mr-4">
                  <AlignJustify />
                </div>
                <Logo />
              </div>
            </div>
            <div className="hidden lg:block col-span-7">
              <Search />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <HeaderIcons total={total} user={user} />
            </div>
          </div>
          <div className="lg:hidden mt-2">
            <Search />
          </div>
        </Wrapper>
      </header>
      <div className="">
        <Wrapper className="hidden lg:block">
          <nav className="flex items-center justify-between">
            <div className="flex items-center bg-[#f7f7f7] w-full rounded-xl">
              <NavbarLinks />
            </div>
          </nav>
        </Wrapper>
      </div>
    </div>
  );
}
