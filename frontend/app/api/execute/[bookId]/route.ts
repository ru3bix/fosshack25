import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { bookId: string } }) {
  const { bookId } = params;

  try {
    const formData = await req.formData();

    const data = new FormData();
    formData.forEach((value, key) => {
      data.append(key, value);
    });

    const apiUrl = `https://mbook-backend.kush.in/render/${bookId}`;

    const response = await axios.put(apiUrl, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = response.data;
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error("Error proxying request:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
