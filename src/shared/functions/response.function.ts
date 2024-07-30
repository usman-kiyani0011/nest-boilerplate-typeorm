export const successResponse = (
  statusCode: number = 200,
  message: string = 'Success',
  data?: any,
  // pagination?: {
  //     count: number;
  //     page: number;
  //     limit: number;
  // }
) => {
  // if (pagination) {
  //     const { count, page, limit } = pagination;
  //     return {
  //         statusCode,
  //         message,
  //         data,
  //         count: count,
  //         pagination:
  //             Array.isArray(data) && count && limit
  //                 ? {
  //                     page,
  //                     limit,
  //                     totalPages: Math.ceil(count / limit),
  //                     resultCount: data.length,
  //                     totalResult: count,
  //                 }
  //                 : null,
  //         error: null,
  //     };
  // } else {
  return {
    statusCode,
    message,
    data,
  };
  // }
};
