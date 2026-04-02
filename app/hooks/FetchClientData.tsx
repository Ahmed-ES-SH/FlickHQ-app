import { useQuery } from "@tanstack/react-query";
import { instance } from "../_components/_globalComponents/AxiosTool";

export function useFetchData<T>(api: string) {
  return useQuery({
    queryKey: [api],
    queryFn: async () => {
      const response = await instance.get(api);
      return response.data as T;
    },
    staleTime: 1000 * 60 * 5, // ❄️ الكاش يظل صالحًا لمدة 5 دقائق
    gcTime: 1000 * 60 * 10, // 🧠 يُخزن في الذاكرة لمدة 10 دقائق حتى لو أصبح غير نشط
  });
}
