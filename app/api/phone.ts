const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/configs`;

interface Phone {
  id: number;
  key: string;
  value: string;
}

export const getPhoneNumber = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}?key=government_phone_number`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: Phone = await response.json();
    return data.value;
  } catch (error) {
    console.error("Error fetching phone number:", error);
    return null;
  }
};
