import api from "@/libs/axios";

async function deleteImage(id: number) {
  await api.delete(`/images/${id}`).catch((err) => console.error(err));
}

export { deleteImage };
