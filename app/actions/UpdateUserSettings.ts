// "use server"

// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { userSettingsSchema } from "../lib/zodSchemas";
// import prisma from "../lib/db";
// import { auth } from "@/auth";

// export async function UpdateUserSettings(prevState: any, formData: FormData) {
//   const session = await auth()
//   const user = session?.user

//   if (!user) {
//     throw new Error("something went wrong");
//   }

//   const validateFields = userSettingsSchema.safeParse({
//     firstName: formData.get("firstName"),
//     lastName: formData.get("lastName"),
//   });

//   if (!validateFields.success) {
//     const state: State = {
//       status: "error",
//       errors: validateFields.error.flatten().fieldErrors,
//       message: "Oops, I think there is a mistake with your inputs.",
//     };

//     return state;
//   }

//   const data = await prisma.user.update({
//     where: {
//       id: user.id,
//     },
//     data: {
//       firstName: validateFields.data.firstName,
//       lastName: validateFields.data.lastName,
//     },
//   });

//   const state: State = {
//     status: "success",
//     message: "Your Settings have been updated",
//   };

//   return state;
// }