import { NextResponse } from "next/server";
import { ApiService } from "../../../services/api";

export async function GET() {
  try {
    // Verificar status da API
    const apiStatus = await ApiService.checkApiStatus();

    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      api: {
        online: apiStatus.isOnline,
        responseTime: apiStatus.responseTime,
        lastChecked: apiStatus.lastChecked,
        error: apiStatus.error,
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
    };

    return NextResponse.json(health, {
      status: apiStatus.isOnline ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
