import prisma from "@/app/lib/db";
import Image from "next/image";
import { cache } from "react";

const getData = cache(async () => {
  const data = await prisma.bannerTop.findMany();
  return data;
});

export async function Hero() {
  const data = await getData();
  const banner = data[0];

  if (banner?.on === true) {
    return (
      <>
        <div className="relative h-[60vh] lg:h-[300px]">
          <Image
            alt="Banner Image"
            src={banner.image}
            fill
            priority
            className="object-cover object-center w-full h-full"
            style={{ objectPosition: "66% 78%" }}
          />
          <div className="z-[1] w-full absolute top-[calc(50%-85px)]">
            <div className="caption-content text-center mx-auto w-[90%] md:w-[80%] lg:w-[50%] bg-[#da8fc2] bg-opacity-70 p-6 rounded-lg" >
              <div className="text-white text-shadow-lg drop-shadow-2xl hero-text" dangerouslySetInnerHTML={{__html:JSON.parse(JSON.stringify(banner.description))}}/>
            </div>
          </div>
        </div>
      </>
    );
  }

  // <Carousel>
  //   <CarouselContent>
  //     {/* {data.map((item) => ( */}
  //       <CarouselItem >
  //         <div className="relative h-[60vh] lg:h-[80vh]">
  //           <Image
  //             alt="Banner Image"
  //             src={'/pngtree-nike-running-shoes-on-black-background-with-colorful-splashes-image_2671040.jpg'}
  //             fill
  //             className="object-cover w-full h-full rounded-xl"
  //           />
  //           <div className="absolute top-6 left-6 bg-opacity-75 bg-black text-white p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
  //             <h1 className="text-xl lg:text-4xl font-bold">Banner test</h1>
  //           </div>
  //         </div>
  //       </CarouselItem>
  //     {/* ))} */}
  //   </CarouselContent>
  //   <CarouselPrevious className="ml-16" />
  //   <CarouselNext className="mr-16" />
  // </Carousel>
}
