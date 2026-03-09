import { H3Event } from "h3";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

});

function serverSupabaseUser(event: H3Event<globalThis.EventHandlerRequest>) {
  throw new Error("Function not implemented.");
  return null;
}
