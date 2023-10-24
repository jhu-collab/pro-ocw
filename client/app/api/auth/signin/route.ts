// same origin endpoint used to securely set the cookie

import { api } from "@/lib/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = await api.post("/auth/signin", {
      email: body.email,
      password: body.password,
    });
    const response = NextResponse.json(
      {
        message: "Login successfully",
      },
      {
        status: 200,
      }
    );
    response.cookies.set({
      name: "token",
      value: data.access_token,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Invalid credentials",
      },
      {
        status: 401,
      }
    );
  }
}
