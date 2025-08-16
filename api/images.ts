import axiosClient from "@/libs/axios";

async function deleteImage(id: number) {
  await axiosClient.delete(`/images/${id}`).catch((err) => {
    console.error(err);
    throw err;
  });
}

export { deleteImage };
