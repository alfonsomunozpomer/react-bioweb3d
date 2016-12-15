const arrayOfThreeNumbers = function (propValue, key, componentName, location, propFullName) {
    if (Array.isArray(propValue[key]) && propValue[key].length === 3 && propValue[key].every(element => !Number.isNaN(element) && Number.isFinite(element))) {
        return null;
    } else {
        return new Error(`Invalid prop '${propFullName}' supplied to '${componentName}'. Validation failed.`);
    }
}

export {arrayOfThreeNumbers};
