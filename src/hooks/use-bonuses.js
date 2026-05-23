import { ENDPOINT } from "../constants/endpoint";
import { useGetRequestQuery } from "../services/api/request";

export const useBonuses = () => {
	const { data, isLoading, isError, refetch } = useGetRequestQuery(
		{
			url: ENDPOINT.GET_BONUSES,
		},
		{
			refetchOnMountOrArgChange: true,
		},
	);

	const bonuses = {
		data: data?.data || [],
		isLoading,
		isError,
	};

	return { bonuses, refetchBonuses: refetch };
};
