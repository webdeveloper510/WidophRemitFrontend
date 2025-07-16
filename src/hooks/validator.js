export const inputValidator = (e, handleChange) => {
    let cleanedValue = '';
    let { name, value } = e.target;
    value = value.replace(/\p{Extended_Pictographic}/gu, '');

    if (name === "other_name" || name === "business_name" || name === "business_nature" || name === "bank_name" || name === "part_type" || name === "payout_part") {
        cleanedValue = value.replace(/[^a-zA-Z0-9 &-]/g, '');
    } else if (name === "account_number" || name === "registration_number" || name === "bank_identifier") {
        cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');
    } else if (name.toLowerCase() === "first_name" || name.toLowerCase() === "middle_name" || name.toLowerCase() === "last_name" || name === "ubo_first_name" || name === "ubo_last_name" || name === "ubo_middle_name") {
        cleanedValue = value.replace(/[^\p{L}\p{N} '`.’-]/gu, '');
    } else if (name === "city" || name === "occupation" || name === "ubo_occupation" || name === "state") {
        cleanedValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ'’. &-]/g, '');
    } else if (name === "email" || name === "ubo_email") {
        cleanedValue = value.replace(/[^a-zA-Z0-9@._+\-]/g, '');
    } else if (name === "postcode" || name === "mobile" || name === "ubo_mobile") {
        cleanedValue = value.replace(/[^0-9-]/g, '');
    } else {
        cleanedValue = value;
    }
    handleChange({ target: { name: e.target.name, value: cleanedValue } })
}


export const getSelectedStreet = async (place, setFieldValue) => {
    const obj = {
        country: "",
        postcode: "",
        city: "",
        state: "",
        street: "",
        building: "",
        address: place?.formatted_address
    }

    await place?.address_components?.forEach((component) => {
        if (component?.types?.includes('postal_code')) {
            obj.postcode = component?.long_name;
        } if (component?.types?.includes('route') || component.types.includes('street_name')) {
            obj.street = component?.long_name.trim();
        } if (component?.types?.includes('locality') || component.types.includes("sublocality_level_1")) {
            obj.city = component?.long_name;
        } if (component?.types?.includes('administrative_area_level_1') && obj.city == "") {
            obj.city = component?.long_name;
        } if (component?.types?.includes('administrative_area_level_1')) {
            obj.state = component?.long_name;
        } if (component?.types?.includes('country')) {
            obj.country = component?.long_name;
        } if (component?.types?.includes('subpremise')) {
            obj.building = component?.long_name;
        } else if (component?.types?.includes('building') || component?.types?.includes('building_number') || component?.types?.includes('street_number') || component?.types?.includes("sublocality_level_2")) {
            obj.building = component?.long_name;
        }
    })

    Object.keys(obj).forEach((key) => {
        setFieldValue(key, obj[key])
    })
}


export const accessProvider = (onboard = "pending", veriff = "not started") => {
    if (onboard === "pending") {
        if (veriff === "not started" || veriff === "started" || veriff === "abandoned" || veriff === "resubmission_requested" || veriff === "expired" || veriff === "pending") {
            return "pending"
        } else {
            return "submitted"
        }
    } else if (onboard === "declined") {
        return "declined"
    } else if (onboard === "approved") {
        return "approved"
    } else if (onboard === "suspended") {
        return "suspended"
    } else {
        return "pending"
    }
}