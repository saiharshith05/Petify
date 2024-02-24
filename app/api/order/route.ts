import { NextResponse } from "next/server";

import { db } from "@/libs/db";
import { currentProfile } from "@/libs/current-profile";


export async function POST(
    req: Request
) {
    try {

        const { productId } = await req.json();

        const profile = await currentProfile();


        if (!profile) {
            return new NextResponse("Unathourized", { status: 401 });
        }


        if (!productId) {
            return new NextResponse("Product ID missing", { status: 400 });
        }

        const product = await db.product.findFirst({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return new NextResponse("Product Not found", { status: 404 });
        }

        const order = await db.order.create({
            data: {
                profileId: profile.id,
                productId: productId,
            },
        });


        return NextResponse.json(order);

    } catch (error) {
        console.log("DONATION: ", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
