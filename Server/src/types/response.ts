
export type ServeResponse = {
	success: boolean;
	message?: string;
	error?: string;
	errors?: Record<string, string[]>;
	data?: any;
}
