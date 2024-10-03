import { AlignJustify } from "lucide-react";
import { NavbarLinks } from "./NavbarLinks";
import { redis } from "@/app/lib/redis";
import { Cart, Wishlist } from "@/app/lib/interfaces";
import Logo from "./Logo";
import Wrapper from "./Wrapper";
import HeaderIcons from "./HeaderIcons";
import Search from "./Search";
import Topbar from "./Topbar";
import { cookies } from "next/headers";
import { auth } from "@/auth";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  const cookieStore = cookies();
  const cartId = cookieStore.get("cartId")?.value;
  const wishilistId = cookieStore.get("wishlistId")?.value;

  const cart: Cart | null = await redis.get(`cart-${cartId}`);

  const wishlist: Wishlist | null = await redis.get(`wishlist-${wishilistId}`);

  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const totalSum =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const totalWishlistProduct = wishlist?.items.length;

  return (
    <>
      <Topbar />
      <div className="bg-white lg:sticky lg:top-0 z-10 lg:shadow-md">
        <header>
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
              <div className="hidden lg:block col-span-6">
                <Search />
              </div>
              <div className="col-span-1 lg:col-span-3">
                <HeaderIcons
                  total={total}
                  totalSum={totalSum}
                  user={user}
                  totalWishlistProduct={totalWishlistProduct}
                />
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
    </>
  );
}
