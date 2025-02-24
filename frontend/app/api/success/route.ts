import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
    const {previewUrl} = await req.json();

    try{
        const response = await axios.get(`${previewUrl.substring(0,previewUrl.lastIndexOf("/"))}/success.txt`);
        const content = response.data;
        if(content === "done\n"){
            return NextResponse.json({done : true} , {status : 200});
        }

        return NextResponse.json({done : false , error : content } , {status : 200});
    }catch(error){
        return NextResponse.json({done : false} , {status : 404});
    }

    
}