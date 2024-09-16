import { Card } from "@/components/ui/card";
import prisma from "../lib/db";
import { SettingsForm } from "../components/form/SettingsForm";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  return data;
}

export default async function SetttingsPage() {
  noStore();
  const session = await auth()
  const user = session?.user

  if (!user) {
    throw new Error("Not Authorized");
  }

  const data = await getData(user.id as string);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <Card>
        <SettingsForm
          firstName={data?.firstName as string}
          lastName={data?.lastName as string}
          email={data?.email as string}
        />
      </Card>
    </section>
  );
}