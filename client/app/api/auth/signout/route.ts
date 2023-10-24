import { api } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const response = NextResponse.redirect(new URL("/signin", req.url));
  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
  });
  return response;
}
