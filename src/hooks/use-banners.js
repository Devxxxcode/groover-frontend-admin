import { toast } from "sonner";
import { ENDPOINT } from "../constants/endpoint";
import { invalidateRequestTag } from "../services/api/invalidate-request-tag";
import {
	useDeleteRequestMutation,
	useGetRequestQuery,
	usePatchRequestMutation,
	usePostRequestMutation,
} from "../services/api/request";
import { validateForm } from "../helpers/validate-form";

export const useBanners = (modalType, closeModal) => {
	const {
		data: eventData,
		isLoading: isLoadingEvent,
		isError: isErrorEvent,
	} = useGetRequestQuery(
		{
			url: ENDPOINT.GET_BANNERS,
		},
		{
			refetchOnMountOrArgChange: true,
		},
	);

	const events = {
		data: eventData?.data,
		isLoading: isLoadingEvent,
		isError: isErrorEvent,
	};

	// Prepare form data for submission
	const prepareFormData = (values = {}) => {
		const formData = new FormData();

		// Iterate over each key in the form values
		Object.keys(values).forEach((key) => {
			// For the 'image' field, check if it's a string or a File
			if (key === "image") {
				if (values[key] instanceof File) {
					formData.append(key, values[key]);
				}
				// If it's a string (URL or empty), skip it in the PUT request
			} else {
				// For other fields, append them to the form data
				formData.append(key, values[key]);
			}
		});

		return formData;
	};

	// Mutation hooks for POST and PUT requests
	const [postEventForm, { isLoading: isAddingEvent }] =
		usePostRequestMutation();
	const [putEventForm, { isLoading: isUpdatingEvent }] =
		usePatchRequestMutation();

	// Handle form submission (add or update)
	const handleEventFormSubmit = async (values) => {
		try {
			const formData = prepareFormData(values);

			// Handle POST request for adding event
			if (modalType === "add") {
				const isValidForm = validateForm(values, ["created_by", "id", "title"]);

				if (!isValidForm) return;

				await postEventForm({
					url: ENDPOINT.POST_BANNERS,
					body: formData,
				}).unwrap();

				closeModal();
				toast.success("Banner added successfully");
			}

			// Handle PUT request for updating event
			if (modalType === "update") {
				const isValidForm = validateForm(values, ["created_by", "id", "title"]);

				if (!isValidForm) return;

				await putEventForm({
					url: ENDPOINT.PUT_BANNER.replace(":id", values?.id),
					body: formData,
				}).unwrap();

				closeModal();
				toast.success("Banner updated successfully");
			}

			invalidateRequestTag(ENDPOINT.GET_BANNERS);
		} catch (error) {
			console.error("Error submitting banner:", error);
		}
	};

	const [deleteEvent, { isLoading: isDeletingEvent }] =
		useDeleteRequestMutation();
	const isLoadingEventForm =
		isAddingEvent || isUpdatingEvent || isDeletingEvent;

	const handleDeleteEvent = async (id = "") => {
		try {
			await deleteEvent({
				url: ENDPOINT.DELETE_BANNER.replace(":id", id),
			});

			toast.success("Banner deleted successfully");
			invalidateRequestTag(ENDPOINT.GET_BANNERS);
			closeModal();
		} catch (err) {
			console.error(err);
		}
	};

	return {
		events,
		handleEventFormSubmit,
		isLoadingEventForm,
		handleDeleteEvent,
	};
};
