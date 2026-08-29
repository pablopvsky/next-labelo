import { handleAuth } from "@workos-inc/authkit-nextjs";

import { syncWorkOSUserSafe } from "@/lib/users/syncWorkOSUser";

export const GET = handleAuth({
  returnPathname: "/dashboard",
  onSuccess: async ({ user }) => {
    await syncWorkOSUserSafe(user);
  },
});
