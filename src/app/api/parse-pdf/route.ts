import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {PDFParse,VerbosityLevel} from "pdf-parse";
import "pdf-parse/worker";
// for commonjs
// require('pdf-parse/worker');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "PDF file not found" },
        { status: 400 }
      );
    }

    // Convert PDF file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const parser = new  PDFParse({data:buffer,verbosity:VerbosityLevel.WARNINGS});
    const data = await parser.getText();
    await parser.destroy();
    return NextResponse.json({
      text: data.text,
      numPages: data.total
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the PDF" },
      { status: 500 }
    );
  }
}
