import {NextResponse} from 'next/server';export function GET(){return NextResponse.json({ok:true,service:'pixelforge-tools',timestamp:new Date().toISOString()})}
