"use server";

import { env } from "~/env";
import axios, { type AxiosResponse } from "axios";
import { type Response } from "../types";
import { catchAcync } from "~/lib/utils";

export async function uploadIoImgBB(base64Image: string): Promise<Response> {
  const data = new FormData();
  data.append("image", base64Image.split("base64,")[1]!);

  return catchAcync(async () => {
    const res: AxiosResponse<{ data: { url: string } }> = await axios.post(
      `https://api.imgbb.com/1/upload?key=${env.IMGBB_API_KEY}`,
      data,
    );

    return {
      success: true,
      data: { url: res.data.data.url },
      message: "Image uploaded successfully",
    };
  });
}
