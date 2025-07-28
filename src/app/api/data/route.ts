import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json(JSON.stringify({ data: "data" }), {
            status: 200,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                JSON.stringify({ message: error.message }),
                {
                    status: 400,
                },
            );
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        await request.formData();
        return NextResponse.json(JSON.stringify({ data: "data" }), {
            status: 200,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                JSON.stringify({ message: error.message }),
                {
                    status: 400,
                },
            );
        }
    }
}
