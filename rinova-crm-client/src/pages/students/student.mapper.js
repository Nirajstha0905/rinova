export const mapStudentToApi = (data) => {
  const { ...rest } = data;
  delete rest.dial_code;

  return {
    ...rest,

    date_of_birth: rest.date_of_birth
      ? new Date(rest.date_of_birth).toISOString()
      : null,

    passport_expiry: rest.passport_expiry
      ? new Date(rest.passport_expiry).toISOString()
      : null,

    middle_name: rest.middle_name || null,
    gender: rest.gender || null,
    address: rest.address || null,
    nationality: rest.nationality || null,
    passport_number: rest.passport_number || null,
    preferred_country: rest.preferred_country || null,
    preferred_course: rest.preferred_course || null,
  };
};
